import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Enable CORS
export async function OPTIONS() {
   return new NextResponse(null, {
      status: 200,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'POST, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type',
      },
   });
}

export async function POST(req: NextRequest) {
   const response = new NextResponse();
   const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
   };

   try {
      const { message, ownerId } = await req.json();
      if (!message || !ownerId) {
         return NextResponse.json({ error: "Message and OwnerId are required" }, { 
            status: 400,
            headers
         });
      }
      await connectDb()
      const setting = await Settings.findOne({ownerId})
      if (!setting) {
         return NextResponse.json({ message: "chat bot is not configured for this user" }, { 
            status: 400,
            headers
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
         const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
         const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
         });
         return NextResponse.json({ text: response.text }, { headers });
      } catch (apiError: any) {
         // Handle quota exceeded and other API errors
         if (apiError?.status === 429 || apiError?.message?.includes('quota')) {
            return NextResponse.json({ 
               error: "API quota exceeded. Please try again later or upgrade your plan.",
               message: "Our AI service is temporarily unavailable due to usage limits. " + setting.supportEmail ? `Please contact us at ${setting.supportEmail}` : "Please contact support." 
            }, { 
               status: 429,
               headers
            });
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
         status: 500,
         headers
      });
   }

}