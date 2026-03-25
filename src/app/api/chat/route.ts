import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

   try {
      const { message, ownerId } = await req.json();
      if (!message || !ownerId) {
         return NextResponse.json({ error: "Message and OwnerId are required" }, { 
            status: 400
         });
      }
      await connectDb()
      const setting = await Settings.findOne({ownerId})
      if (!setting) {
         return NextResponse.json({ message: "chat bot is not configured for this user" }, { 
            status: 400
         });

      }
      const KNOWLEDGE = `
      business name- ${setting.businessName || "not provided"}
      support email- ${setting.supportEmail || "not provided"}
      knowledge - ${setting.knowledge || "not provided"}
     
      `
      const prompt = `
      You are a professional customer support assistant for this business.
      Use only the information provided below to answer the customer's question.
      you may rephrase, summarize, or interpret the information if needed.
      Do Not invent new policies, prices, or promises.
      If the customer's question is completely unrelated to the information, 
      or cannot be reasonably answered from it, reply exactly with:
      "Please contact our customer support for further assistance."
      
      --------------------
      BUSINESS INFORMATION
      ---------------------
      ${KNOWLEDGE}
      
      ----------------------
      CUSTOMER QUESTION
      ----------------------
      ${message}
      ----------------------
      ANSWER:
      `;
      
      try {
         const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
         const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
         });
         const text = completion.choices[0]?.message?.content || "No response";
         return NextResponse.json({ text });
      } catch (apiError: Error | unknown) {
         const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
         if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            return NextResponse.json({
               error: "API quota exceeded. Please try again later.",
               message: `Our AI service is temporarily unavailable due to usage limits. ${
                  setting.supportEmail
                     ? `Please contact us at ${setting.supportEmail}`
                     : "Please contact support."
               }`,
            }, { status: 429 });
         }
         throw apiError;
      }


   } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ 
         error: errorMessage,
         message: `Chat error: ${errorMessage}` 
      }, { 
         status: 500
      });
   }

}