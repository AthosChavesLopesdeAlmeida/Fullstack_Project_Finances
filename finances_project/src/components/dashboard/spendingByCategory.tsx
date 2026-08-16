'use client'
import { useEffect, useState } from "react"
import { SpendingByCategoryType } from "@/types/dashboard"
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"

import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const SpendingByCategory = () => {
  const [data, setData] = useState<SpendingByCategoryType[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchChartData = async () => {
    setIsLoading(true)

    const { ok, status, data } = await apiFetch('/api/dashboard/spending_by_category', {
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
    total: {
      label: "Total gasto",
    },
    Food: {
      label: "Food",
      color: "var(--chart-1)",
    },
    Transport: {
      label: "Transport",
      color: "var(--chart-2)",
    },
    Housing: {
      label: "Housing",
      color: "var(--chart-3)",
    },
    Health: {
      label: "Health",
      color: "var(--chart-4)",
    },
    Education: {
      label: "Education",
      color: "var(--chart-5)",
    },
    Leisure: {
      label: "Leisure",
      color: "var(--chart-1)",
    },
    Shopping: {
      label: "Shopping",
      color: "var(--chart-2)",
    },
    Bills: {
      label: "Bills",
      color: "var(--chart-3)",
    },
    Other: {
      label: "Other",
      color: "var(--chart-4)",
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
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data.map((item) => ({
            category: item.category,
            total: item.total,
            fill: `var(--color-${item.category})`
          }))}
          dataKey="total"
          nameKey="category"
        />
      </PieChart>
    </ChartContainer>
  )
}

export default SpendingByCategory