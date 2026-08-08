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

  useEffect(() => {
    fetchAccounts()
  }, [])

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 shrink-0 border-r shadow-sm flex flex-col gap-3 p-4">
        <h3 className="font-semibold mb-2">Menu</h3>

        {/* Links verdadeiros serão adicionados mais tarde */}
        <Button variant="ghost" className="justify-start">My account</Button>
        <Button variant="ghost" className="justify-start">Dashboard</Button>
        <Button variant="ghost" className="justify-start">How to use</Button>
      </nav>

      <main className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your accounts</h2>
          <Button onClick={() => setIsFormOpen((prev) => !prev)}>
            {isFormOpen ? 'Cancel' : 'Create account'}
          </Button>
        </div>

        {isFormOpen && (
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

                  <Button type="submit" className="w-fit">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {accounts.length === 0 ? (
          <section className="grid grid-cols-1 gap-4 text-center py-12">
            <h1 className="text-lg">You have no account yet!</h1>
            {error && <p className="text-red-500">{error}</p>}
          </section>
        ) : (
          <section className="grid grid-cols-3 gap-4">
            {accounts.map((acc: Account) => (
              <Card key={acc.id} className="dark">
                <CardHeader>
                  <CardTitle>{acc.account_name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {acc.created_at}
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}