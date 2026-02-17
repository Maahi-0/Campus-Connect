import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
    const cookieStore = await cookies()

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        console.warn('Supabase credentials missing. Server client will not be initialized.')
        return null
    }

    return createServerClient(
        url,
        key,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                    }
                },
            },
        }
    )
}



import { redirect } from 'next/navigation'

export async function getUserProfile() {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { user: null, profile: null }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return { user, profile }
}

export async function requireRole(allowedRoles) {
    const { user, profile } = await getUserProfile()

    if (!user) {
        redirect('/auth/login')
    }

    const role = profile?.role || user.user_metadata?.role || 'student'

    if (!allowedRoles.includes(role)) {
        redirect('/dashboard')
    }

    return { user, profile, role }
}
