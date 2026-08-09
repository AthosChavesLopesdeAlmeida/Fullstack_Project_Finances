import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { budget_name, start_date, end_date, value, acc_id } = await req.json()

  if (!budget_name || !start_date || !end_date || !value) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
  }

  const existing = await prisma.budget.findUnique({
    where: {
      acc_id_budget_name: { acc_id, budget_name },
    },
  })
  
  if (existing) {
    return NextResponse.json({ message: 'An budget with this name already exists' }, { status: 400 })
  }

  const budget = await prisma.budget.create({
    data: { 
      budget_value: value, 
      end_date: new Date(end_date), 
      acc_id: acc_id, 
      start_date: new Date(start_date), 
      budget_name: budget_name 
    }
  })

  return NextResponse.json(budget, { status: 201 })
}