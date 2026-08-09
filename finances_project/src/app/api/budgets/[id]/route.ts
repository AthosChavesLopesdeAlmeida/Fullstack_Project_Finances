import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const budget = await prisma.budget.findUnique({
    where: {id}
  })

  if (!budget) {
    return NextResponse.json({ message: 'Budget not found' }, { status: 400 })
  }

  await prisma.budget.delete({
    where: {id}
  })

  return NextResponse.json({message: 'Budget deleted with success'}, {status: 200})
}

export async function GET (req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const budget = await prisma.budget.findUnique({
    where: {id}
  })

  if (!budget) {
    return NextResponse.json({ message: 'Budget not found' }, { status: 400 })
  }

  const expenses = await prisma.expense.findMany({
    where: {budget_id: id}
  })

  return NextResponse.json(expenses, {status: 200})
}