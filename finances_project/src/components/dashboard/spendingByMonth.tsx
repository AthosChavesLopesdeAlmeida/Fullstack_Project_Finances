'use client'
import { useEffect, useState } from "react"
import { SpendingByMonthType } from "@/types/dashboard"
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const SpendingByMonth = () => {
  const [data, setData] = useState<SpendingByMonthType[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchChartData = async () => {
    setIsLoading(true)

    const { ok, status, data: responseData } = await apiFetch('/api/dashboard/spending_by_month', {
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
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12
        }}>
          <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="total"
              type="natural"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-total)",
              }}
              activeDot={{
                r: 6,
              }}
            />
      </LineChart>
    </ChartContainer>
  )
}

export default SpendingByMonth