import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Attempt to fetch profile
    let { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Fallback to metadata if DB record hasn't synced yet
    const rawRole = profile?.role || user.user_metadata?.role || 'student'
    const userRole = rawRole.toLowerCase().trim()

    console.log(`[DASHBOARD_REDIRECT] User: ${user.email}, Role: ${rawRole}, Normalized: ${userRole}`)

    // Redirect based on role
    switch (userRole) {
        case 'admin':
            console.log(`[DASHBOARD_REDIRECT] Redirecting to /dashboard/admin`)
            return redirect('/dashboard/admin')
        case 'club_lead':
        case 'lead':
            console.log(`[DASHBOARD_REDIRECT] Redirecting to /dashboard/lead`)
            return redirect('/dashboard/lead')
        case 'student':
        default:
            console.log(`[DASHBOARD_REDIRECT] Redirecting to /dashboard/student`)
            return redirect('/dashboard/student')
    }
}
