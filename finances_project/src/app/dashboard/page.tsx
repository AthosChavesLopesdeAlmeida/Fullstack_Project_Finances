'use client'
import SpendingByAccount from '@/components/dashboard/spendingByAccount'
import SpendingByCategory from '@/components/dashboard/spendingByCategory'
import SpendingByMonth from '@/components/dashboard/spendingByMonth'
import { House, CircleUserRound, ChartColumn } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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

      <main className="flex-1 p-8 flex flex-col gap-8">
        <div className="flex items-center justify-start">
          <h2 className="text-2xl font-bold">Your dashboard</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by category</CardTitle>
              <CardDescription>Your spendings grouped by expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByCategory/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by account</CardTitle>
              <CardDescription>How much you have spent for each of your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByAccount/>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Spending by month</CardTitle>
              <CardDescription>Your spendings for each month of the year</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingByMonth/>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Page