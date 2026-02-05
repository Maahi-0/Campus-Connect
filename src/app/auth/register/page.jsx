'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('student')
    const [instituteName, setInstituteName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                        institute_name: instituteName,
                        avatar_url: avatarUrl,
                    }
                }
            })

            if (error) throw error

            router.push('/auth/login?message=Registration successful! Please check your email or log in.')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6 py-20">
            <div className="w-full max-w-[480px] animate-fade-in">
                <div className="glass p-12 rounded-[2.5rem] shadow-2xl border border-white/5 bg-black/40 card-shadow">
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-block text-4xl font-black gradient-text mb-4 tracking-tighter">Campus Connect</Link>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Create Profile Network</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Identity Designation</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                    placeholder="Legal Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Institute Authority</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                    placeholder="University / College Name"
                                    value={instituteName}
                                    onChange={(e) => setInstituteName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Visual Identity (URL)</label>
                                <input
                                    type="url"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                    placeholder="https://example.com/photo.jpg"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                />
                            </div>

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
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Secret Key</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-700"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest px-1">Access Protocol</label>
                                <select
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none cursor-pointer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="student" className="bg-black">Student Access</option>
                                    <option value="club_lead" className="bg-black">Club Administrator</option>
                                    <option value="admin" className="bg-black">System Moderator</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest">
                                Protocol Violation: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-[1.5rem] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-xl shadow-primary/25 border border-primary/20 uppercase tracking-widest text-xs mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                'Synchronize Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-white/5 pt-8">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Foundational Profile Exists?
                        </p>
                        <Link href="/auth/login" className="text-white hover:text-primary font-black uppercase tracking-widest text-[11px] transition-colors border-b border-white/10 pb-1">
                            Authenticate Existing User
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

