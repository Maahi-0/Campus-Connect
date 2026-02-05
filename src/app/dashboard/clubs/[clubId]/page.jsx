import { createSupabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function ClubDetails({ params }) {
    const { clubId } = await params;
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // Fetch club details
    const { data: club } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

    if (!club) notFound();

    // Check if current user is a lead for this club
    const { data: membership } = await supabase
        .from('club_members')
        .select('role')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .single();

    const isLead = membership?.role === 'lead';

    // Fetch member count
    const { count: memberCount } = await supabase
        .from('club_members')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', clubId);

    // Fetch events for this club
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('club_id', clubId)
        .order('event_date', { ascending: false });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary transition-colors mb-4 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-extrabold text-white">{club.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${club.is_approved ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {club.is_approved ? 'Verified' : 'Pending Verification'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 mb-6">
                        <span className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {memberCount} Members
                        </span>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl">{club.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {isLead && (
                        <Link
                            href={`/dashboard/clubs/${clubId}/members`}
                            className="glass-card hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl transition-all border border-white/10 flex items-center justify-center"
                        >
                            Manage Members
                        </Link>
                    )}
                    {isLead && (
                        <Link
                            href={`/dashboard/clubs/${clubId}/create-event`}
                            className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center"
                        >
                            + Create New Event
                        </Link>
                    )}
                </div>
            </div>

            <section className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                </div>

                {events?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event.id} className="glass-card rounded-2xl p-6 flex flex-col border border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-widest ${event.status === 'published' ? 'bg-indigo-500/10 text-indigo-400' :
                                        event.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                                            'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {event.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6">{event.description}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {event.location}
                                    </span>
                                    <Link href={`/dashboard/events/${event.id}`} className="text-xs font-bold text-primary hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center rounded-3xl border-dashed border-white/10">
                        <div className="text-4xl mb-4">📢</div>
                        <h3 className="text-xl font-semibold mb-2">No events found for this club</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            {isLead ? "Start by creating your first event to share with students." : "This club hasn't published any events yet."}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

