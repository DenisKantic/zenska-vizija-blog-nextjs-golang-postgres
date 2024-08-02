import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Retrieve the token from cookies
  console.log('middleware is running')
  const token = req.cookies.get('token')?.value

  // If token is not present, redirect to login page
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Optional: Add more logic to validate the token with your backend here

  return NextResponse.next()
}

// Apply middleware to the /dashboard path and its subpaths
export const config = {
  matcher: ['/dashboard/:path*'],
}
