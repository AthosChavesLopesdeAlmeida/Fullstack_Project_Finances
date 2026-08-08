'use client'
import { apiFetch } from "@/lib/fetcher"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const Page = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')

    const {ok, data} = await apiFetch("api/auth/register", {
      method: 'POST',
      body: JSON.stringify({ name, password, email })
    })

    if (!ok) {
      setError(data?.message || 'Error creating account')
      return
    }
    
    router.push('/')
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your data bellow to create an account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-8">

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input required id="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input required id="password" type="password" onChange={(e) => setPassword(e.target.value)}/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input required id="name" type="text" onChange={(e) => setName(e.target.value)}/>
              </div>

              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit">Register</Button>
          <Button onClick={() => router.push('/login')}>Already have an account? Log in</Button>
        </CardFooter>

      </Card>
    </div>
  )
}

export default Page