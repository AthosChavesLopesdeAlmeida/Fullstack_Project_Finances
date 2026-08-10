'use client'
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/fetcher"

import { Expense } from "@/types/expense"
import { Budget } from "@/types/budget"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"

import { 
  Card,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Page = () => {
  const { id } = useParams<{ id: string }>()

  const [isFormOpen, setIsFormOpen] = useState(false)

  const [category, setCategory] = useState<string | null>(null)
  const [value, setValue] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budget, setBudget] = useState<Budget>()

  const router = useRouter()

  const EXPENSE_CATEGORIES = [
    'Food', 'Transport', 'Housing', 'Health',
    'Education', 'Leisure', 'Shopping', 'Bills', 'Other',
  ] as string[] 

  const handleCreateExpense = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const { ok, status, data } = await apiFetch(`/api/expenses`, {
      method: 'POST',
      body: JSON.stringify({
        category: category,
        budget_id: id,
        spent_value: value
      })
    })

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error creating expense')
      return
    }

    setCategory('')
    setValue(0)

    setIsFormOpen(false)
    fetchExpenses(id)
  }

  const fetchExpenses = async (id: string) => {
    const {ok, data, status} = await apiFetch(`/api/budgets/${id}`, {
      method: 'GET'
    })

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error fetching expenses')
      return
    }

    setExpenses(data)
    calculateTotalSpent()
  }

  const fetchSpecificBudget = async (id: string) => {
    const {ok, data, status} = await apiFetch(`/api/budget_value/${id}`, {
      method: 'GET'
    })

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error fetching the value of this budget')
      return
    }

    setBudget(data)
  }


  const calculateTotalSpent = () => {
    let total = 0

    for (const expense of expenses) {
      total += Number(expense.spent_value)
    }

    setTotalSpent(total)
  }

  useEffect(() => {
    fetchSpecificBudget(id)
  }, [id])

  useEffect(() => {
    fetchExpenses(id)
  }, [id])

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r shadow-sm flex flex-col gap-3 p-4">
        <h3 className="font-semibold mb-2">Menu</h3>

        {/* Links verdadeiros serão adicionados mais tarde */}
        <Button variant="ghost" className="justify-start hover:cursor-pointer">Your account</Button>
        <Button variant="ghost" className="justify-start hover:cursor-pointer">Dashboard</Button>
        <Button variant="ghost" className="justify-start hover:cursor-pointer">How to use</Button>
      </nav>

      <main className="flex-1 p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your budget</h2>
            <Button onClick={() => setIsFormOpen((prev) => !prev)} className="hover:cursor-pointer">
              {isFormOpen ? 'Cancel' : 'Submit expense'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Card className="dark hover:cursor-pointer">
              <CardHeader>
                <CardTitle>{budget ? `Budget: ${Number(budget?.budget_value).toFixed(2)}` : 'Loading...'}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="dark hover:cursor-pointer">
              <CardHeader>
                <CardTitle>{totalSpent ? `Spent: ${Number(totalSpent).toFixed(2)}` : 'Loading...'}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="dark hover:cursor-pointer">
              <CardHeader>
                <CardTitle>{totalSpent && budget ? `Remaining: ${Number(budget.budget_value - totalSpent).toFixed(2)}` : 'Loading...'}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a new expense</DialogTitle>
              <DialogDescription>Fill the data and submit</DialogDescription>
            </DialogHeader>

              <form onSubmit={handleCreateExpense}>
                <div className="flex flex-col gap-4">

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>

                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="value">Spent value</Label>
                    <Input
                      required
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-fit hover:cursor-pointer">Create</Button>
                </div>
              </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableCaption>All of your expenses in this budget</TableCaption>
          <TableHeader>
            <TableRow>Value spent</TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
          </TableHeader>
          <TableBody>
            {expenses.map((exp: Expense) => {
              return (
                <TableCell key={exp.id}>${Number(exp.spent_value).toFixed(2)}</TableCell>
              )
            })}
            {expenses.map((exp: Expense) => {
              return (
                <TableCell key={exp.id}><Badge variant="default">{exp.category}</Badge></TableCell>
              )
            })}
            {expenses.map((exp: Expense) => {
              return (
                <TableCell key={exp.id}>{new Date(exp.created_at).toLocaleDateString()}</TableCell>
              )
            })}
          </TableBody>
        </Table>
        
      </main>
    </div>
  )
}

export default Page