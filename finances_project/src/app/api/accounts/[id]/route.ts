import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const account = await prisma.account.findUnique({
    where: {id}
  })

  if (!account) {
    return NextResponse.json({ message: 'Account not found' }, { status: 400 })
  }

  const budgets = await prisma.budget.findMany({
    where: { acc_id: account.id }
  })

  if (!budgets) {
    return NextResponse.json({ message: 'No budgets found' }, { status: 200 })
  }

  return NextResponse.json(budgets)
}