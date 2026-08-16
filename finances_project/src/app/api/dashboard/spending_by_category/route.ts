import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET (req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({message: 'User unauthorized'}, {status: 401})
  }

  const spendingByCategory = await prisma.expense.groupBy({
    by: ['category'],
    where: {
      budget: {
        account: {
          user: user
        }
      }
    },
    _sum:{
      spent_value: true
    }
  })

  const formatted = spendingByCategory.map((item) => ({
    category: item.category,
    total: item._sum.spent_value ?? 0
  }))

  return NextResponse.json(formatted)
}