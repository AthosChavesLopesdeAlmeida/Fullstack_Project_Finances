import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET (req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({message: 'User unauthorized'}, {status: 401})
  }

  const accounts = await prisma.account.findMany({
    where: { user: user },
    include: {
      budgets: {
        include: {
          expense: true
        }
      }
    }  
  })

  if (!accounts) {
    return NextResponse.json({message: 'No accounts found'}, {status: 201})
  }

  const spendingByAccount = accounts.map((account) => {
    const total = account.budgets.reduce((sum, budget) => {
      const budgetTotal = budget.expense.reduce((s, e) => s + e.spent_value, 0)
      return sum + budgetTotal
    }, 0)

    return {
      account_id: account.id,
      account_name: account.account_name,
      total_spent: total
    }
  })

  return NextResponse.json(spendingByAccount)
}