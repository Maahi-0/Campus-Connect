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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-10 py-6 bg-transparent">
            {/* Left Spacer for desktop to keep center alignment true centering if possible, 
                but simple centering for now */}
            <div className="hidden md:block w-72"></div>

            <div className="flex-grow text-center max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="opacity-50">Pages</span>
                    <span className="opacity-30">/</span>
                    <span className="text-[#0b87bd] border-b-2 border-[#0b87bd]/20 pb-0.5">{title}</span>
                </div>

                <div className="relative inline-block mb-3">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#0b87bd] via-[#0ea5e9] to-[#0284c7] drop-shadow-sm pb-2">
                        {title}
                    </h1>
                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-8 text-[#0b87bd]/10 transform rotate-12">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                </div>

                <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.25em] relative inline-block">
                    <span className="relative z-10 px-4 bg-[#f3f4f6]">{subtitle}</span>
                    <span className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-0"></span>
                </p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-4 w-72 relative">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search clubs & events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border-2 border-transparent focus:border-[#0b87bd]/20 focus:bg-white rounded-2xl pl-12 pr-6 py-3 text-sm font-semibold text-gray-900 outline-none transition-all w-64 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {isSearching ? (
                            <div className="w-4 h-4 border-2 border-[#0b87bd] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {searchQuery.trim().length >= 2 && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {results.clubs.length === 0 && results.events.length === 0 && !isSearching ? (
                                <div className="p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">No results found</div>
                            ) : (
                                <>
                                    {results.clubs.length > 0 && (
                                        <div className="mb-2">
                                            <div className="px-3 py-1 text-[10px] font-black text-[#0b87bd] uppercase tracking-widest opacity-50">Clubs</div>
                                            {results.clubs.map(club => (
                                                <Link key={club.id} href={`/dashboard/clubs/${club.id}`} className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors group">
                                                    <div className="w-2 h-2 rounded-full bg-[#0b87bd] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <span className="text-sm font-bold text-gray-700">{club.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {results.events.length > 0 && (
                                        <div>
                                            <div className="px-3 py-1 text-[10px] font-black text-[#0b87bd] uppercase tracking-widest opacity-50">Events</div>
                                            {results.events.map(event => (
                                                <Link key={event.id} href={`/dashboard/events/${event.id}`} className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors group">
                                                    <div className="w-2 h-2 rounded-full bg-[#0b87bd] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <span className="text-sm font-bold text-gray-700">{event.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <NotificationDropdown user={user} />
            </div>
        </header>
    )
}
