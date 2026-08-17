'use client'
import { useEffect, useState } from "react"
import { SpendingByAccountType } from "@/types/dashboard"
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const SpendingByAccount = () => {
  const [data, setData] = useState<SpendingByAccountType[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchChartData = async () => {
    setIsLoading(true)

    const { ok, status, data: responseData } = await apiFetch('/api/dashboard/spending_by_account', {
      method: 'GET'
    })

    if (status === 401) {
      router.push('/register')
      setIsLoading(false)
      return
    }

    if (!ok) {
      setError(responseData?.message || 'Unable to fetch data')
      setIsLoading(false)
      return
    }

    setData(responseData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchChartData()
  }, [])

  const chartConfig = {
    total: {
      label: "Total spent",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  if (isLoading === true) {
    return <h3 className="text-sm text-muted-foreground">Loading...</h3>
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="account_name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}

export default SpendingByAccount