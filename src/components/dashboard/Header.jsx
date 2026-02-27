'use client'

import NotificationDropdown from './NotificationDropdown'
import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Header({ title, subtitle, user }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState({ clubs: [], events: [] })
    const [isSearching, setIsSearching] = useState(false)
    const supabase = createSupabaseClient()

    useEffect(() => {
        const search = async () => {
            if (searchQuery.trim().length < 2) {
                setResults({ clubs: [], events: [] })
                return
            }
            setIsSearching(true)
            try {
                const [clubRes, eventRes] = await Promise.all([
                    supabase.from('clubs').select('id, name').ilike('name', `%${searchQuery}%`).eq('is_approved', true).limit(5),
                    supabase.from('events').select('id, title').ilike('title', `%${searchQuery}%`).eq('is_admin_approved', true).eq('status', 'published').limit(5)
                ])
                setResults({
                    clubs: clubRes.data || [],
                    events: eventRes.data || []
                })
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsSearching(false)
            }
        }
        const timer = setTimeout(search, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0 py-10 bg-transparent">
            <div className="flex-grow text-center md:text-left max-w-xl">
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    <span className="opacity-70">Control Panel</span>
                    <span className="opacity-30">/</span>
                    <span className="text-orange-600 border-b-2 border-orange-200 pb-0.5">{title}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4">
                    {title}
                </h1>

                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-6 w-full md:w-auto relative">
                <div className="relative group flex-grow md:flex-grow-0">
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-slate-200 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none transition-all w-full md:w-80 shadow-xl shadow-slate-100 placeholder:text-slate-300"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        {isSearching ? (
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchQuery.trim().length >= 2 && (
                        <div className="absolute top-full mt-4 left-0 right-0 bg-white border border-slate-100 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-[100] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {results.clubs.length === 0 && results.events.length === 0 && !isSearching ? (
                                <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No matching nodes</div>
                            ) : (
                                <>
                                    {results.clubs.length > 0 && (
                                        <div className="mb-6">
                                            <div className="px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Clubs</div>
                                            {results.clubs.map(club => (
                                                <Link key={club.id} href={`/dashboard/clubs/${club.id}`} className="flex items-center px-4 py-3 hover:bg-orange-50 rounded-2xl transition-all group">
                                                    <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 tracking-tight">{club.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {results.events.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Events</div>
                                            {results.events.map(event => (
                                                <Link key={event.id} href={`/dashboard/events/${event.id}`} className="flex items-center px-4 py-3 hover:bg-orange-50 rounded-2xl transition-all group">
                                                    <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 tracking-tight">{event.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                <NotificationDropdown user={user} />
            </div>
        </header>
    )
}
