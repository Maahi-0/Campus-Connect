import { createBrowserClient } from '@supabase/ssr'

let supabaseClient;

export function createSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        console.warn('Supabase credentials missing. Client will not be initialized.')
        return null
    }

    supabaseClient = createBrowserClient(url, key)
    return supabaseClient;
}
