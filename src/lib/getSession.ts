import { cookies } from "next/headers"
import { scalekit } from "./scalekit"

export async function getSession(){
   const session = await cookies()
   const token = session.get("access_token")?.value
   if(!token){
      return null
   }
   try {
      const result = await scalekit.validateToken(token) as { sub: string }
      const user=await scalekit.user.getUser(result.sub)
      return user
      
   } catch (error) {
      console.log(error)
      
   }

}
