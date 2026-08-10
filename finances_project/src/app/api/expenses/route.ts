import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { spent_value, category, budget_id } = await req.json()

  if (!spent_value || !category) {
    return NextResponse.json({message: 'All the fields are required'})
  }

  const expense = await prisma.expense.create({
    data: {
      category: category,
      spent_value: spent_value,
      budget_id: budget_id
    }
  })

  return NextResponse.json(expense, {status: 200})
}