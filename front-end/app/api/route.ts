import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "./auth/[...nextauth]/route";

export const GET = async()=>
{
    const data = await getServerSession(authOptions);
    console.log("Server Side Session",data);
    return NextResponse.json({auth:!!data});
}