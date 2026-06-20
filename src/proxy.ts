import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieItem = { name: string; value: string; options?: Record<string, unknown> }

const publicPaths = ['/login', '/register', '/auth/callback', '/api/', '/suspended']

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false
  try { new URL(url); return true }
  catch { return false }
}

export async function proxy(request: NextRequest) {
  if (!isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll() as unknown as CookieItem[]
        },
        setAll(cookiesToSet: CookieItem[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isPublicPath = publicPaths.some((p) => request.nextUrl.pathname.startsWith(p))

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Preserve auth error params
    if (request.nextUrl.searchParams.has('error')) {
      url.search = request.nextUrl.search
    }
    return NextResponse.redirect(url)
  }

  if (user && isPublicPath && !request.nextUrl.pathname.startsWith('/api/') && request.nextUrl.pathname !== '/auth/callback' && request.nextUrl.pathname !== '/suspended') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
