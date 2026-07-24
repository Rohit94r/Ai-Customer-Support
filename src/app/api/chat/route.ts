import connectDb from "@/lib/db";
import {
   CHAT_LANGUAGES,
   DEFAULT_CHAT_LANGUAGE,
   getLanguageConfig,
   isSupportedLanguage,
} from "@/lib/chatLanguages";
import { checkRateLimit, clientIpFromRequest } from "@/lib/rateLimit";
import { FREE_MONTHLY_QUESTION_LIMIT, currentPeriodKey } from "@/lib/usage";
import { validateChatMessage, validateOwnerId } from "@/lib/validation";
import ChatQuestion from "@/model/chatQuestion.model";
import Settings from "@/model/settings.model";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function normalizeQuestion(message: string) {
   return message.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildKnowledgeSignature({
   businessName,
   supportEmail,
   knowledge,
}: {
   businessName?: string;
   supportEmail?: string;
   knowledge?: string;
}) {
   return crypto
      .createHash("sha256")
      .update(
         JSON.stringify({
            businessName: businessName || "",
            supportEmail: supportEmail || "",
            knowledge: knowledge || "",
         })
      )
      .digest("hex");
}

async function bumpUsage(ownerId: string, askedAt: Date, periodKey: string) {
   const setting = await Settings.findOne({ ownerId });
   if (!setting) return;

   if (setting.monthlyPeriodKey === periodKey) {
      await Settings.findOneAndUpdate(
         { ownerId },
         {
            $inc: { totalQuestions: 1, monthlyQuestions: 1 },
            $set: { lastChatAt: askedAt },
         }
      );
      return;
   }

   await Settings.findOneAndUpdate(
      { ownerId },
      {
         $inc: { totalQuestions: 1 },
         $set: {
            lastChatAt: askedAt,
            monthlyQuestions: 1,
            monthlyPeriodKey: periodKey,
         },
      }
   );
}

export async function POST(req: NextRequest) {
   try {
      const ip = clientIpFromRequest(req);
      let body: { message?: unknown; ownerId?: unknown; language?: unknown };

      try {
         body = await req.json();
      } catch {
         return NextResponse.json(
            {
               error: "Invalid JSON body",
               message: "Could not read your message. Please try again.",
            },
            { status: 400 }
         );
      }

      const ownerId = validateOwnerId(body.ownerId);
      if (!ownerId) {
         return NextResponse.json(
            {
               error: "Owner ID is required",
               message: "This chatbot is missing its owner ID. Please check the embed code.",
            },
            { status: 400 }
         );
      }

      const messageCheck = validateChatMessage(body.message);
      if (!messageCheck.ok) {
         return NextResponse.json(
            { error: messageCheck.error, message: messageCheck.error },
            { status: 400 }
         );
      }
      const message = messageCheck.message;
      const language = body.language;

      const ipLimit = checkRateLimit(`chat:ip:${ip}`, 40, 60_000);
      if (!ipLimit.allowed) {
         return NextResponse.json(
            {
               error: "Too many requests",
               message: "You're sending messages too quickly. Please wait a moment and try again.",
            },
            {
               status: 429,
               headers: { "Retry-After": String(ipLimit.retryAfterSec) },
            }
         );
      }

      const ownerLimit = checkRateLimit(`chat:owner:${ownerId}`, 60, 60_000);
      if (!ownerLimit.allowed) {
         return NextResponse.json(
            {
               error: "Too many requests",
               message: "This chatbot is busy right now. Please try again in a minute.",
            },
            {
               status: 429,
               headers: { "Retry-After": String(ownerLimit.retryAfterSec) },
            }
         );
      }

      await connectDb();
      const setting = await Settings.findOne({ ownerId });
      if (!setting) {
         return NextResponse.json(
            {
               error: "Chatbot not configured",
               message:
                  "This chatbot is not set up yet. The business owner needs to add their details in the Apna AI dashboard.",
            },
            { status: 400 }
         );
      }

      if (!setting.knowledge?.trim() || !setting.businessName?.trim()) {
         return NextResponse.json(
            {
               error: "Chatbot incomplete",
               message:
                  "This chatbot is still being set up. Please check back soon, or contact the business directly.",
            },
            { status: 503 }
         );
      }

      const periodKey = currentPeriodKey();
      const monthlyUsed =
         setting.monthlyPeriodKey === periodKey ? setting.monthlyQuestions || 0 : 0;

      if (monthlyUsed >= FREE_MONTHLY_QUESTION_LIMIT) {
         return NextResponse.json(
            {
               error: "Monthly limit reached",
               message: setting.supportEmail
                  ? `We've hit our chat limit for this month. Please email ${setting.supportEmail} for help.`
                  : "We've hit our chat limit for this month. Please contact the business directly.",
               usage: {
                  monthlyQuestions: monthlyUsed,
                  limit: FREE_MONTHLY_QUESTION_LIMIT,
               },
            },
            { status: 429 }
         );
      }

      const enabledLanguages = Array.isArray(setting.supportedLanguages)
         ? setting.supportedLanguages.filter((value: string) => isSupportedLanguage(value))
         : [];
      const requestedLanguage =
         typeof language === "string" && isSupportedLanguage(language)
            ? language
            : undefined;
      const activeLanguage =
         requestedLanguage && enabledLanguages.includes(requestedLanguage)
            ? requestedLanguage
            : typeof setting.defaultLanguage === "string" &&
                isSupportedLanguage(setting.defaultLanguage)
              ? setting.defaultLanguage
              : DEFAULT_CHAT_LANGUAGE;
      const languageConfig = getLanguageConfig(activeLanguage);
      const normalizedQuestion = normalizeQuestion(message);
      const knowledgeSignature = buildKnowledgeSignature({
         businessName: setting.businessName,
         supportEmail: setting.supportEmail,
         knowledge: setting.knowledge,
      });
      const askedAt = new Date();
      const KNOWLEDGE = `
      business name- ${setting.businessName || "not provided"}
      support email- ${setting.supportEmail || "not provided"}
      knowledge - ${setting.knowledge || "not provided"}
     
      `;
      const prompt = `
      You are a professional customer support assistant for this business.
      Use only the information provided below to answer the customer's question.
      You may rephrase, summarize, or interpret the information if needed.
      Do not invent new policies, prices, or promises.
      Always reply in ${languageConfig.label} using a natural, customer-friendly tone.
      The supported customer languages for this bot are: ${CHAT_LANGUAGES.map((item) => item.label).join(", ")}.
      If the customer's question is completely unrelated to the information,
      or cannot be reasonably answered from it, reply exactly with:
      "${languageConfig.fallbackMessage}"
      
      --------------------
      BUSINESS INFORMATION
      ---------------------
      ${KNOWLEDGE}

      ----------------------
      RESPONSE LANGUAGE
      ----------------------
      ${languageConfig.label} (${languageConfig.code})
      
      ----------------------
      CUSTOMER QUESTION
      ----------------------
      ${message}
      ----------------------
      ANSWER:
      `;

      try {
         const cachedResponse = await ChatQuestion.findOne({
            ownerId,
            normalizedQuestion,
            responseLanguage: activeLanguage,
            knowledgeSignature,
         });

         if (cachedResponse) {
            cachedResponse.latestQuestion = message;
            cachedResponse.lastAskedAt = askedAt;
            cachedResponse.askedCount += 1;
            cachedResponse.cacheHits += 1;
            cachedResponse.recentQuestions = [
               { question: message, askedAt },
               ...cachedResponse.recentQuestions,
            ].slice(0, 8);
            await Promise.all([cachedResponse.save(), bumpUsage(ownerId, askedAt, periodKey)]);
            return NextResponse.json({
               text: cachedResponse.answer,
               language: activeLanguage,
               cached: true,
            });
         }

         const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
         const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
         });
         const text = completion.choices[0]?.message?.content || "No response";
         await Promise.all([
            ChatQuestion.findOneAndUpdate(
               {
                  ownerId,
                  normalizedQuestion,
                  responseLanguage: activeLanguage,
                  knowledgeSignature,
               },
               {
                  ownerId,
                  normalizedQuestion,
                  latestQuestion: message,
                  answer: text,
                  responseLanguage: activeLanguage,
                  knowledgeSignature,
                  askedCount: 1,
                  cacheHits: 0,
                  firstAskedAt: askedAt,
                  lastAskedAt: askedAt,
                  recentQuestions: [{ question: message, askedAt }],
               },
               { upsert: true, new: true, setDefaultsOnInsert: true }
            ),
            bumpUsage(ownerId, askedAt, periodKey),
         ]);
         return NextResponse.json({ text, language: activeLanguage, cached: false });
      } catch (apiError: Error | unknown) {
         const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
         if (
            errorMessage.includes("429") ||
            errorMessage.includes("quota") ||
            errorMessage.includes("rate limit")
         ) {
            return NextResponse.json(
               {
                  error: "AI temporarily unavailable",
                  message: setting.supportEmail
                     ? `${languageConfig.fallbackMessage} ${setting.supportEmail}`
                     : languageConfig.fallbackMessage,
               },
               { status: 429 }
            );
         }
         throw apiError;
      }
   } catch (error) {
      console.error("Chat API Error:", error);
      return NextResponse.json(
         {
            error: "Something went wrong",
            message: "Sorry, we couldn't answer right now. Please try again in a moment.",
         },
         { status: 500 }
      );
   }
}
