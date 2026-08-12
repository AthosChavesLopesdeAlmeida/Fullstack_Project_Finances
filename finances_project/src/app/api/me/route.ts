import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET (req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401})
  }

  const userData = await prisma.user.findUnique({
    where: {id: user.userId},
  })

  return NextResponse.json(userData, {status: 200})
}