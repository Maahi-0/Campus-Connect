'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            window.location.href = '/dashboard'
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6">
            <div className="w-full max-w-[440px] animate-fade-in">
                <div className="glass p-12 rounded-[2.5rem] shadow-2xl border border-white/5 bg-black/40 card-shadow">
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-block text-4xl font-black gradient-text mb-4 tracking-tighter">Campus Connect</Link>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Portal Authentication</p>
                    </div>

                    {message && (
                        <div className="mb-8 bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-3 rounded-2xl text-xs font-bold text-center uppercase tracking-widest">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Email Coordinates</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2 px-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secret Key</label>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest">
                                Failure: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-[1.5rem] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/25 border border-primary/20 uppercase tracking-widest text-xs"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                'Initiate Access'
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Protocol Neutral
                        </p>
                        <Link href="/auth/register" className="text-white hover:text-primary font-black uppercase tracking-widest text-[11px] transition-colors border-b border-white/10 pb-1">
                            Register Primary Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

