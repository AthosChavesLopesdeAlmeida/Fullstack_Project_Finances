'use client'
import SpendingByAccount from '../../components/dashboard/spendingByAccount'
import SpendingByCategory from '../../components/dashboard/spendingByCategory'
import SpendingByMonth from '../../components/dashboard/spendingByMonth'
import { House, CircleUserRound, ChartColumn } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const Page = () => {
  const router = useRouter()

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r shadow-sm flex flex-col gap-3 p-4">
        <h3 className="font-semibold mb-2">Menu</h3>

        <Button variant="ghost" className="justify-start hover:cursor-pointer" onClick={() => router.push('/me')}> 
          <CircleUserRound className="w-4 h-4 mr-2"/> My account
        </Button>

        <Button variant="ghost" className="justify-start hover:cursor-pointer">
          <ChartColumn className="w-4 h-4 mr-2"/> Dashboard
        </Button>

        <Button variant="ghost" className="justify-start hover:cursor-pointer" onClick={() => router.push('/')}>
          <House className="w-4 h-4 mr-2"/> Home
        </Button>
      </nav>

      <main className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-start">
          <h2 className="text-2xl font-bold">Your budgets</h2>
        </div>

        <section className="flex flex-col gap-15">
          <Card>
            <CardHeader>
              <CardTitle>Spendings by account</CardTitle>
              <CardDescription>This graph indicates how much you have spent for each of your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByAccount/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spendings by category</CardTitle>
              <CardDescription>This graph indicates your spendings grouped by expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByCategory/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spendings by month</CardTitle>
              <CardDescription>This graph indicates your spendings for each month of the year</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByMonth/>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default Page