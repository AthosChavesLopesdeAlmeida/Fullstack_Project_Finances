'use client'
import { useEffect, useState } from "react";
import { Budget } from "@/types/budget";
import { apiFetch } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { House, CircleUserRound, ChartColumn, Trash2, Plus } from "lucide-react";


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

  const classifyBudget = (bud: Budget) => {
    const now = new Date()
    const isExpired = new Date(bud.end_date) < now
    const isOverBudget = bud.total_spent > bud.budget_value

    if (isOverBudget) return 'exceeded'
    if (isExpired) return 'expired'
    return 'active'
  }

  useEffect(() => {
    fetchBudgets()
  }, [id])

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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your budgets</h2>
          <Button onClick={() => setIsFormOpen((prev) => !prev)} className="hover:cursor-pointer">
            <Plus className="w-4 h-4 mr-2"/>
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

                  <Button type="submit" className="w-fit hover:cursor-pointer"> <Plus className="w-4 h-4 mr-2"/> Create</Button>
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
          <section className="flex flex-col gap-15">

            <Card className="flex gap-4">
              <CardHeader className="text-xl font-semibold">Active budgets</CardHeader>

              <section className="grid grid-cols-4 gap-6 p-3">
                {budgets.filter((bud) => classifyBudget(bud) === 'active').map((bud: Budget)=> (
                  <Card key={bud.id} 
                  className="dark hover:cursor-pointer hover:shadow-md hover:opacity-98 transition-opacity duration-300 ease-in-out" 
                  onClick={() => router.push(`/budget/${bud.id}`)}>
                    <CardHeader className="gap-4">
                      <CardTitle>{bud.budget_name}</CardTitle>
                      <CardDescription>Value: ${Number(bud.budget_value).toFixed(2)}</CardDescription>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground grid grid cols-1 gap-4">
                      Start: {new Date(bud.start_date).toLocaleDateString()} - End: {new Date(bud.end_date).toLocaleDateString()}
                      <Button onClick={() => handleDeleteBudget(bud.id)} className="w-1/3 cursor-pointer" variant="destructive">
                       <Trash2 className="w-4 h-4 mr-2"/> Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>             
            </Card>

            <Card className="flex gap-4">
              <CardHeader className="text-xl font-semibold">Expired budgets</CardHeader>

              <section className="grid grid-cols-4 gap-6 p-3">
                {budgets.filter((bud) => classifyBudget(bud) === 'expired').map((bud: Budget) => (
                  <Card key={bud.id} 
                  className="dark hover:cursor-pointer hover:shadow-md hover:opacity-98 transition-opacity duration-300 ease-in-out" 
                  onClick={() => router.push(`/budget/${bud.id}`)}>
                    <CardHeader className="gap-4">
                      <CardTitle>{bud.budget_name}</CardTitle>
                      <CardDescription>Value: ${Number(bud.budget_value).toFixed(2)}</CardDescription>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground grid grid cols-1 gap-4">
                      Start: {new Date(bud.start_date).toLocaleDateString()} - End: {new Date(bud.end_date).toLocaleDateString()}
                      <Button onClick={() => handleDeleteBudget(bud.id)} className="w-1/3 cursor-pointer" variant="destructive">
                       <Trash2 className="w-4 h-4 mr-2"/> Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>             
            </Card>          

            <Card className="flex gap-4">
              <CardHeader className="text-xl font-semibold">Overrun budgets</CardHeader>

              <section className="grid grid-cols-4 gap-6 p-3">
                {budgets.filter((bud) => classifyBudget(bud) === 'exceeded').map((bud: Budget) => (
                  <Card key={bud.id} 
                  className="dark hover:cursor-pointer hover:shadow-md hover:opacity-98 transition-opacity duration-300 ease-in-out" 
                  onClick={() => router.push(`/budget/${bud.id}`)}>
                    <CardHeader className="gap-4">
                      <CardTitle>{bud.budget_name}</CardTitle>
                      <CardDescription>Value: ${Number(bud.budget_value).toFixed(2)}</CardDescription>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground grid grid cols-1 gap-4">
                      Start: {new Date(bud.start_date).toLocaleDateString()} - End: {new Date(bud.end_date).toLocaleDateString()}
                      <Button onClick={() => handleDeleteBudget(bud.id)} className="w-1/3 cursor-pointer" variant="destructive">
                       <Trash2 className="w-4 h-4 mr-2"/> Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>             
            </Card>         

          </section>
        )}
      </main>
    </div>
  );
}