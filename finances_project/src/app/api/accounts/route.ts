import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const accounts = await prisma.account.findMany({
    where: { user_id: user.userId },
  })

  return NextResponse.json(accounts)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { account_name } = await req.json()

  if (!account_name) {
    return NextResponse.json({ message: 'The account name is required' }, { status: 400 })
  }

  const existing = await prisma.account.findFirst({
    where: { user_id: user.userId, account_name },
  })

  if (existing) {
    return NextResponse.json({ message: 'An account with this name already exists' }, { status: 400 })
  }

  const account = await prisma.account.create({
    data: { account_name, user_id: user.userId },
  })

  return NextResponse.json(account, { status: 201 })
}