'use client'
import { useEffect, useState } from "react";
import { Budget } from "@/types/budget";
import { apiFetch } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"


import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function Home() {
  const { id } = useParams<{ id: string }>()

  const [budgets, setBudgets] = useState<Budget[]>([])

  const [newBudgetName, setNewBudgetName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [value, setValue] = useState(0)

  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const router = useRouter()

  const fetchBudgets = async () => {
    const { ok, data, status } = await apiFetch(`/api/accounts/${id}`)
    
    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error fetching your budgets')
      return
    }

    setBudgets(data)
  }

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { ok, data, status } = await apiFetch('/api/budgets', {
      method: 'POST',
  
      body: JSON.stringify({ 
       budget_name: newBudgetName, 
       start_date: startDate, 
       end_date: endDate, 
       value,
       acc_id: id
      })
    })
    
    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error creating budget')
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date')
      return
    }
    
    fetchBudgets()

    setNewBudgetName('')
    setValue(0)
    setStartDate('')
    setEndDate('')

    setIsFormOpen(false)
  }

  const handleDeleteBudget = async (id: string) => {
    const { ok, data, status } = await apiFetch(`/api/budgets/${id}`, {
      method: 'DELETE'
    })

    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error deleting budget')
      return
    }

    fetchBudgets()
  }

  useEffect(() => {
    fetchBudgets()
  }, [id])

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r shadow-sm flex flex-col gap-3 p-4">
        <h3 className="font-semibold mb-2">Menu</h3>

        {/* Links verdadeiros serão adicionados mais tarde */}
        <Button variant="ghost" className="justify-start hover:cursor-pointer" onClick={() => router.push('/me')}>My account</Button>
        <Button variant="ghost" className="justify-start hover:cursor-pointer">Dashboard</Button>
        <Button variant="ghost" className="justify-start hover:cursor-pointer">How to use</Button>
      </nav>

      <main className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your budgets</h2>
          <Button onClick={() => setIsFormOpen((prev) => !prev)} className="hover:cursor-pointer">
            {isFormOpen ? 'Cancel' : 'Create budget'}
          </Button>
        </div>



        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new account</DialogTitle>
              <DialogDescription>Give a name to this account and create a budget</DialogDescription>
            </DialogHeader>

              <form onSubmit={handleCreateBudget}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget_name">Budget name</Label>
                    <Input
                      required
                      id="budget_name"
                      type="text"
                      value={newBudgetName}
                      onChange={(e) => setNewBudgetName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="value">Budget value</Label>
                    <Input
                      required
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="start_date">Start date</Label>
                    <Input
                      required
                      id="start_date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="end_date">End date</Label>
                    <Input
                      required
                      id="end_date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-fit hover:cursor-pointer">Create</Button>
                </div>
              </form>
          </DialogContent>
        </Dialog>

        {/* {isFormOpen && (
          <Card className="dark w-full max-w-md">
            <CardHeader>
              <CardTitle>Create a new budget</CardTitle>
              <CardDescription>Give a name to this budget and create it!</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreateBudget}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget_name">Budget name</Label>
                    <Input
                      required
                      id="budget_name"
                      type="text"
                      value={newBudgetName}
                      onChange={(e) => setNewBudgetName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="value">Budget value</Label>
                    <Input
                      required
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="start_date">Start date</Label>
                    <Input
                      required
                      id="start_date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="end_date">End date</Label>
                    <Input
                      required
                      id="end_date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-fit hover:cursor-pointer">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )} */}

        {budgets.length === 0 ? (
          <section className="grid grid-cols-1 gap-4 text-center py-12">
            <h1 className="text-lg">You have no budgets yet!</h1>
            {error && <p className="text-red-500">{error}</p>}
          </section>
        ) : (
          <section className="grid grid-cols-4 gap-6">
            {budgets.map((bud: Budget ) => (
              <Card key={bud.id} className="dark hover:cursor-pointer" onClick={() => router.push(`/budget/${bud.id}`)}>
                <CardHeader className="gap-4">
                  <CardTitle>{bud.budget_name}</CardTitle>
                  <CardDescription>Value: ${Number(bud.budget_value).toFixed(2)}</CardDescription>
                </CardHeader>

                <CardContent className="text-sm text-muted-foreground grid grid cols-1 gap-4">
                  Start: {new Date(bud.start_date).toLocaleDateString()} - End: {new Date(bud.end_date).toLocaleDateString()}
                  <Button onClick={() => handleDeleteBudget(bud.id)} className="w-1/2">Delete</Button>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}