import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Retrieve the token from cookies
  console.log('middleware is running on route:', req.nextUrl.pathname)
  const token = req.cookies.get('token')?.value
  const isLoginPage = req.nextUrl.pathname === '/login'

  //If token is not present, redirect to login page
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Apply middleware to the /dashboard path and its subpaths
export const config = {
  matcher: ['/dashboard/:path*'],
}
