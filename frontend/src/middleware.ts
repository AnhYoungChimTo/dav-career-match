import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Public paths that don't require auth
    const isPublicPath = path === '/' || path.startsWith('/auth')

    // Protected paths
    const isProtectedPath =
        path.startsWith('/dashboard') ||
        path.startsWith('/jobs') ||
        path.startsWith('/job-match') ||
        path.startsWith('/profile') ||
        path.startsWith('/onboarding')

    // 1. If NOT logged in
    if (!user) {
        // Attempt to access protected route -> Redirect to login
        if (isProtectedPath) {
            return NextResponse.redirect(new URL('/auth?mode=login', request.url))
        }
        // Allow access to public paths
        return response
    }

    // 2. If logged in
    if (user) {
        // Check onboarding status
        const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        const isOnboardingCompleted = profile?.onboarding_completed

        // If onboarding NOT completed
        if (!isOnboardingCompleted) {
            // Allow access to onboarding
            if (path.startsWith('/onboarding')) {
                return response
            }
            // Force redirect to onboarding for any other path (including public ones like home)
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // If onboarding completed
        if (isOnboardingCompleted) {
            // If trying to access public paths or onboarding -> Redirect to Dashboard
            if (isPublicPath || path.startsWith('/onboarding')) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
            // Allow access to protected paths
            return response
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
