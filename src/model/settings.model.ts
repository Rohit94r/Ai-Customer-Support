import mongoose, {model, Schema} from "mongoose";
import { DEFAULT_CHAT_LANGUAGE } from "@/lib/chatLanguages";


interface ISettings{
   ownerId:string
   businessName:string
   supportEmail:string
   knowledge:string
   defaultLanguage:string
   supportedLanguages:string[]
   totalQuestions:number
   monthlyQuestions:number
   monthlyPeriodKey:string
   lastChatAt:Date | null
}

const settingsSchema=new Schema<ISettings>({
   ownerId:{
      type:String,
      required:true,
      unique:true
   },
   businessName:{
      type:String,
     
   },
   supportEmail:{
      type:String,
     
   },
   knowledge:{
      type:String,
     
   },
   defaultLanguage: {
      type: String,
      default: DEFAULT_CHAT_LANGUAGE,
   },
   supportedLanguages: {
      type: [String],
      default: [DEFAULT_CHAT_LANGUAGE, "hi-IN", "mr-IN", "gu-IN"],
   },
   totalQuestions: {
      type: Number,
      default: 0,
   },
   monthlyQuestions: {
      type: Number,
      default: 0,
   },
   monthlyPeriodKey: {
      type: String,
      default: "",
   },
   lastChatAt: {
      type: Date,
      default: null,
   },

},{timestamps:true})

const Settings = mongoose.models.Settings || model("Settings", settingsSchema)

export default Settings
