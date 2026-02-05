import { createSupabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function EventDetails({ params }) {
    const { eventId } = await params;
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: event } = await supabase
        .from('events')
        .select(`
      *,
      clubs (
        id,
        name,
        description
      )
    `)
        .eq('id', eventId)
        .single();

    if (!event) notFound();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-10">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary transition-colors mb-4 inline-block">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-widest">
                            {event.clubs?.name}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm font-medium">
                            {new Date(event.event_date).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                        {event.title}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                About this Event
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        <div className="md:w-64 space-y-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Location</h3>
                                <div className="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-white font-medium">{event.location}</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Organized By</h3>
                                <Link href={`/dashboard/clubs/${event.clubs?.id}`} className="block group">
                                    <div className="text-white font-bold group-hover:text-primary transition-colors">{event.clubs?.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">View Profile &rarr;</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <button className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 rounded-xl transition-all">
                            Save to Calendar
                        </button>
                        <div className="flex gap-4">
                            <button className="p-4 glass-card rounded-xl hover:bg-white/10 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
