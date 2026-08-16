'use client'
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { apiFetch } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
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
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [newAccountName, setNewAccountName] = useState('')
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const router = useRouter()

  const fetchAccounts = async () => {
    const { ok, data, status } = await apiFetch("/api/accounts")
    
    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error fetching your accounts')
      return
    }

    setAccounts(data)
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { ok, data, status } = await apiFetch('/api/accounts', {
      method: 'POST',
      body: JSON.stringify({ account_name: newAccountName })
    })
    
    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error fetching your accounts')
      return
    }
    
    fetchAccounts()
    setNewAccountName('')
    setIsFormOpen(false)
  }

  const handleDeleteAccount = async (id: string) => {
    const { ok, status, data } = await apiFetch(`/api/accounts/${id}`, {
      method: 'DELETE'
    })

    if (status === 401) {
      router.push('/register')
      return
    }
    
    if (!ok) {
      setError(data?.message || 'Error deleting this account')
      return
    }
    
    fetchAccounts()
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

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
          <h2 className="text-xl font-semibold">Your accounts</h2>
          <Button onClick={() => setIsFormOpen((prev) => !prev)} className="hover:cursor-pointer">
            <Plus className="w-4 h-4 mr-2"/>
            {isFormOpen ? 'Cancel' : 'Create account'}
          </Button>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new account</DialogTitle>
              <DialogDescription>Give a name to this account and create a budget</DialogDescription>
            </DialogHeader>

              <form onSubmit={handleCreateAccount}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account_name">Account name</Label>
                    <Input
                      required
                      id="account_name"
                      type="text"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-fit hover:cursor-pointer">
                    <Plus className="w-4 h-4 mr-2"/>Create
                  </Button>

                </div>
              </form>
          </DialogContent>
        </Dialog>

        {/* {isFormOpen && (
          <Card className="dark w-full max-w-md">
            <CardHeader>
              <CardTitle>Create a new account</CardTitle>
              <CardDescription>Give a name to this account and create a budget!</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreateAccount}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account_name">Account name</Label>
                    <Input
                      required
                      id="account_name"
                      type="text"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-fit hover:cursor-pointer">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )} */}

        {accounts.length === 0 ? (
          <section className="grid grid-cols-1 gap-4 text-center py-12">
            <h1 className="text-lg">You have no account yet!</h1>
            {error && <p className="text-red-500">{error}</p>}
          </section>
        ) : (

            <section className="grid grid-cols-3 gap-4">
              {accounts.map((acc: Account) => (
                <Card key={acc.id} className="dark hover:cursor-pointer" onClick={() => router.push(`/account/${acc.id}`)}>
                  <CardHeader>
                    <CardTitle>{acc.account_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground grid grid cols-1 gap-4">
                    Conta criada em {new Date(acc.created_at).toLocaleDateString()}
                    <Button onClick={() => handleDeleteAccount(acc.id)} variant="destructive" className="w-1/4 cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2"/> Delete 
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </section>
        )}
      </main>
    </div>
  );
}