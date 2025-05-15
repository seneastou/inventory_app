import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnecté' })
  response.cookies.set({
    name: 'user_session',
    value: '',
    path: '/',
    expires: new Date(0),
  })
  return response
}
