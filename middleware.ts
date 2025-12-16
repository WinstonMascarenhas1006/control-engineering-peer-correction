import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // MAINTENANCE MODE - Block all access
  const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true' || true // Set to true to enable maintenance
  
  if (MAINTENANCE_MODE) {
    // Allow only admin login page and admin login API (so admin can still access)
    const isAdminLogin = request.nextUrl.pathname === '/admin/login'
    const isAdminLoginAPI = request.nextUrl.pathname === '/api/admin/login'
    
    if (isAdminLogin || isAdminLoginAPI) {
      // Continue to admin login
    } else {
      // Block everything else - API routes return JSON, pages return HTML
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Site is under maintenance. Please try again later.' },
          { status: 503, headers: { 'Retry-After': '3600' } }
        )
      }
      
      // Block pages with maintenance page
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>Site Under Maintenance</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    .container {
      text-align: center;
      max-width: 600px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    p {
      font-size: 20px;
      line-height: 1.6;
      opacity: 0.9;
    }
    .icon {
      font-size: 80px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔧</div>
    <h1>Site Under Maintenance</h1>
    <p>We're currently performing maintenance. Please check back soon.</p>
    <p style="margin-top: 20px; font-size: 16px; opacity: 0.7;">Thank you for your patience.</p>
  </div>
</body>
</html>`,
        {
          status: 503,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': '3600',
          },
        }
      )
    }
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Strict Transport Security (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Content Security Policy for admin pages
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths including API routes
     * Only exclude static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

