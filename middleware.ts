import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
 
  const isPublicPath = path === '/admin/login'
 
  const token = request.cookies.get('session')?.value || ''
 
  if (path.startsWith('/admin') && !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
 
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
}
 
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}