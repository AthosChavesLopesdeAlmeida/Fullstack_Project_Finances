import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const budget = await prisma.budget.findUnique({
    where: { id }
  })

  if (!budget) {
    return NextResponse.json({message: 'Budget not found'}, {status: 400})
  }

  return NextResponse.json(budget, {status: 200})
}