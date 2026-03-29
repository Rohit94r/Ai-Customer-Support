
import connectDb from "@/lib/db";
import { DEFAULT_CHAT_LANGUAGE, isSupportedLanguage } from "@/lib/chatLanguages";
import Settings from "@/model/settings.model";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req:NextRequest){
   try {
      const{
         ownerId,
         businessName,
         supportEmail,
         knowledge,
         defaultLanguage,
         supportedLanguages,
      }=await req.json()
      if(!ownerId){
         return NextResponse.json(
            {message:"owner id is required"},
            {status:400}
         )
      }
      const normalizedSupportedLanguages = Array.isArray(supportedLanguages)
         ? supportedLanguages.filter(
              (language): language is string =>
                 typeof language === "string" && isSupportedLanguage(language)
           )
         : [];
      const safeSupportedLanguages = normalizedSupportedLanguages.length
         ? normalizedSupportedLanguages
         : [DEFAULT_CHAT_LANGUAGE, "hi-IN", "mr-IN", "gu-IN"];
      const safeDefaultLanguage =
         typeof defaultLanguage === "string" &&
         isSupportedLanguage(defaultLanguage) &&
         safeSupportedLanguages.includes(defaultLanguage)
            ? defaultLanguage
            : safeSupportedLanguages[0] || DEFAULT_CHAT_LANGUAGE;
      await connectDb()
      const settings=await Settings.findOneAndUpdate(
         {ownerId},
         {
            businessName,
            supportEmail,
            knowledge,
            defaultLanguage: safeDefaultLanguage,
            supportedLanguages: safeSupportedLanguages,
         },
         {new:true,upsert:true}
      )
      return NextResponse.json(settings)
   } catch (error) {
      return NextResponse.json(
         {message:`settings error ${error}`},
         {status:400}
      )
   }


}
