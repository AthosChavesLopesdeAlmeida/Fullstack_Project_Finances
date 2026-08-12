import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user =  await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401})
  }

  await prisma.user.delete({ where: { id: user.userId } })

  const res = NextResponse.json({message: 'Account deleted successfully'}, {status: 200})
  res.cookies.set('token', '', { maxAge: 0 })
  return res
}