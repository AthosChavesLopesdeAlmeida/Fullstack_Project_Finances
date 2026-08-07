import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string)

export interface TokenPayload {
  userId: string
}

export async function hashPassword (password: string) {
  return await bcrypt.hash(password, 10) 
} 

export async function verifyPassword (password:string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function generateToken (userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return await verifyToken(token)
}