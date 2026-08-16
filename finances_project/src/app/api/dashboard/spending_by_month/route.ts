import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
  }

  const expenses = await prisma.expense.findMany({
    where: {
      budget: {
        account: {
          user_id: user.userId
        }
      }
    },
    select: {
      spent_value: true,
      created_at: true
    }
  })

  const grouped: Record<string, number> = {}

  for (const exp of expenses) {
    const monthKey = exp.created_at.toISOString().slice(0, 7) // "2026-08"
    grouped[monthKey] = (grouped[monthKey] ?? 0) + exp.spent_value
  }

  const formatted = Object.entries(grouped)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return NextResponse.json(formatted)
}