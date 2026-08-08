import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({message: 'Name, email and password are required'}, {status: 400})
  }

  const user = await prisma.user.findUnique({where: { email }})
  if (user) {
    return NextResponse.json({message: 'Your account already exists, log in'}, {status: 409})
  }

  const hashedPassword = await hashPassword(password)
  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword }
  })

  const token = await generateToken(newUser.id)
  const response = NextResponse.json({ message: 'User created with success' }, {status: 201})

   response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/' 
  })
  return response
}