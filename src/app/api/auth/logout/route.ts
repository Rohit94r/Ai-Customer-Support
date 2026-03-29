
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore=  await cookies();
  cookiesStore.delete("access_token")
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
   
} 
