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

    const { ok, status, data } = await apiFetch('/api/dashboard/spending_by_account', {
      method: 'GET'
    })

    if (status === 401) {
      router.push('/register')
      setIsLoading(false)
      return
    }

    if (!ok) {
      setError(data?.message || 'Unable to fetch data')
      setIsLoading(false)
      return
    }

    setData(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchChartData()
  }, [])


  const chartConfig = {
    account: {
      label: "Account",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  if (isLoading === true) {
    return <h3>Loading...</h3>
  }

  if (error) {
    return <h3 className="bg-red-600">{error}</h3>
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false}>
          <XAxis
          dataKey="Account"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel/>}
          />
          <Bar dataKey="Account" fill="bg-blue-300" radius={8}/>
        </CartesianGrid>
      </BarChart>
    </ChartContainer>
  )
}

export default SpendingByAccount