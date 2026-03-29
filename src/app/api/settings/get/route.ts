import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { CHAT_LANGUAGES, DEFAULT_CHAT_LANGUAGE } from "@/lib/chatLanguages";

export async function POST(req:NextRequest){
try {
   const {ownerId}=await req.json()
   if(!ownerId){
            return NextResponse.json(
               {message:"owner id is required"},
               {status:400}
            )
         }
         await connectDb()
         const settings=await Settings.findOne(
            {ownerId}
         )
         if(!settings){
            return NextResponse.json({
               businessName: "",
               supportEmail: "",
               knowledge: "",
               defaultLanguage: DEFAULT_CHAT_LANGUAGE,
               supportedLanguages: CHAT_LANGUAGES.map((language) => language.code),
            })
         }
         return NextResponse.json(settings)
} catch (error) {
    return NextResponse.json(
         {message:`get settings error ${error}`},
         {status:400}
      )
}
}
