'use client'
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import { apiFetch } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [newAccountName, setNewAccountName] = useState('')
  const [error, setError] = useState('')

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
      body: JSON.stringify({account_name: newAccountName})
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
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return (
    <div className="flex">
      <nav className="min-w-[20%] border-l-1 border-black-500 grid grid-cols-1 gap-5 bg-blue-500">
        <h3>Menu</h3>

        {/* Links verdadeiros serão adicionados mais tarde */}
        <Button>My account</Button>
        <Button>Dashboard</Button>
        <Button>How to use</Button>
      </nav>

      <main className="min-w-[80%] bg-red-500">
        {accounts.length === 0 ? (
          <section className="grid grid-cols-1 gap-4 text-center">
            <h1>You have no account yet!</h1>
            <Button>Create one here</Button>
            {error && <p className="text-red-500">{error}</p>}
          </section>
        ) : (
          <section>
            {accounts.map((acc: Account) => (
              <Card key={acc.id}>
                <CardTitle>{acc.account_name}</CardTitle>
                <CardContent>{acc.created_at}</CardContent>
              </Card>
            ))}
          </section>
        )}

        <Card className="w-300 h-500">
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
            <CardDescription>Give a name to this account and create a budget!</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => handleCreateAccount(e)}>
              <div className="flex flex-col gap-8">
                <div className="grid gap-2">
                  <Label htmlFor="account_name">Account name</Label>
                  <Input required id="account_name" type="text" onChange={(e) => setNewAccountName(e.target.value)}/>
                </div>


                {error && <p className="text-red-500">{error}</p>}
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <Button type="submit">Create</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
