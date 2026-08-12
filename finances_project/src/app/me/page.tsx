'use client'

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/fetcher"
import { useRouter } from "next/navigation"
import { User } from "@/types/user"

import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

const Page = () => {
  const [user, setUser] = useState<User>()
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchUser = async () => {
    const { ok, status, data } = await apiFetch('/api/me')

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error fetching user')
      return
    }

    setUser(data)
  }

  const deleteUser = async () => {
    const { ok, status, data } = await apiFetch('/api/me')

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error deleting user')
      return
    }

    router.push('/register')
  }


  const logoutUser = async () => {
    const { ok, status, data } = await apiFetch('/api/me')

    if (status === 401) {
      router.push('/register')
      return
    }

    if (!ok) {
      setError(data?.message || 'Error logging out')
      return
    }

    router.push('/login')
  }

  useEffect(() => {
    fetchUser()
  }, [])

return (
  <div className="flex min-h-screen">
    <nav className="w-56 shrink-0 border-r shadow-sm flex flex-col gap-3 p-4">
      <h3 className="font-semibold mb-2">Menu</h3>
      <Button variant="ghost" className="justify-start hover:cursor-pointer">My account</Button>
      <Button variant="ghost" className="justify-start hover:cursor-pointer">Dashboard</Button>
      <Button variant="ghost" className="justify-start hover:cursor-pointer">How to use</Button>
    </nav>

    <main className="flex-1 p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your account</h2>
      </div>

      {!user ? (
        <section className="grid grid-cols-1 gap-4 text-center py-12">
          <h1 className="text-lg">Loading...</h1>
          {error && <p className="text-red-500">{error}</p>}
        </section>
      ) : (
        <section className="flex justify-center">
          <Card className="w-full max-w-sm text-center dark">
            <CardHeader>
              <CardDescription>{user.email}</CardDescription>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
              <p>Conta criada em {new Date(user.createdAt).toLocaleDateString()}</p>

              <div className="flex gap-2">
                <Button onClick={logoutUser} variant="outline">Logout</Button>
                <Button onClick={deleteUser} variant="destructive">Delete account</Button>
              </div>

              {error && <p className="text-red-500">{error}</p>}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  </div>
)
}

export default Page