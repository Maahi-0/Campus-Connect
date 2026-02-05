import { createSupabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile || profileError) {
        // If profile doesn't exist, we might need to create it or redirect
        // For now, let's redirect to login to be safe, or handle it as an error
        redirect('/auth/login?message=Profile not found. Please contact support.');
    }

    // Fetch relevant data based on role
    let data = {};

    if (profile.role === 'student') {
        const { data: events } = await supabase
            .from('events')
            .select('*, clubs(name)')
            .eq('status', 'published')
            .order('event_date', { ascending: true });
        data.events = events;

        const { count: clubCount } = await supabase
            .from('clubs')
            .select('*', { count: 'exact', head: true })
            .eq('is_approved', true);
        data.clubCount = clubCount || 0;
    } else if (profile.role === 'club_lead') {
        const { data: myClubs } = await supabase
            .from('club_members')
            .select(`
                role,
                clubs (
                    *,
                    club_members(count)
                )
            `)
            .eq('user_id', user.id)
            .eq('role', 'lead');

        data.myClubs = myClubs?.map(mc => ({
            ...mc.clubs,
            memberCount: mc.clubs.club_members[0]?.count || 0
        })) || [];
    } else if (profile.role === 'admin') {
        const { data: pendingClubs } = await supabase
            .from('clubs')
            .select('*')
            .eq('is_approved', false);
        data.pendingClubs = pendingClubs || [];
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 animate-fade-in tracking-tighter">
                        Welcome back, <span className="gradient-text">{profile.full_name || user.email}</span>
                    </h1>
                    <p className="text-gray-500 animate-fade-in font-medium uppercase tracking-widest text-xs" style={{ animationDelay: '0.1s' }}>
                        Authenticated as <span className="text-primary font-black">{profile.role}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {profile.role === 'student' && (
                            <section>
                                <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white/90 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Upcoming Events
                                </h2>
                                <div className="space-y-4">
                                    {data.events?.length > 0 ? (
                                        data.events.map(event => (
                                            <div key={event.id} className="glass-card p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.03]">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{event.clubs?.name}</span>
                                                        <span className="text-gray-700 text-xs">•</span>
                                                        <span className="text-xs text-gray-500 font-bold">{new Date(event.event_date).toLocaleString()}</span>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white mb-2">{event.title}</h3>
                                                    <p className="text-gray-400 text-sm line-clamp-1 font-medium">{event.description}</p>
                                                </div>
                                                <Link href={`/dashboard/events/${event.id}`} className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap">
                                                    View Details
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="glass-card p-16 text-center rounded-[2rem] border-dashed border-white/5 bg-black/50">
                                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No events discovered yet</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {profile.role === 'club_lead' && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black uppercase tracking-widest text-white/90 flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                        Managed Clubs
                                    </h2>
                                    <Link href="/dashboard/clubs/new" className="text-xs font-black text-primary hover:text-white uppercase tracking-widest transition-colors">
                                        + Register New Club
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.myClubs?.length > 0 ? (
                                        data.myClubs.map(club => (
                                            <Link key={club.id} href={`/dashboard/clubs/${club.id}`} className="glass-card p-8 rounded-[2rem] group hover:border-primary/50 bg-black/40">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${club.is_approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        {club.is_approved ? 'Approved' : 'Pending'}
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors mb-3 leading-tight">{club.name}</h3>
                                                <p className="text-gray-500 text-sm mb-8 line-clamp-2 font-medium">{club.description}</p>
                                                <div className="flex gap-3">
                                                    <span className="text-[10px] font-black text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest">
                                                        {club.memberCount} Members
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-2 glass-card p-16 text-center rounded-[2rem] border-dashed border-white/5">
                                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">You don't lead any clubs yet</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {profile.role === 'admin' && (
                            <section>
                                <h2 className="text-xl font-black uppercase tracking-widest text-white/90 mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                                    Verification Queue
                                </h2>
                                <div className="space-y-4">
                                    {data.pendingClubs?.length > 0 ? (
                                        data.pendingClubs.map(club => (
                                            <div key={club.id} className="glass-card p-8 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.03]">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{club.name}</h3>
                                                    <p className="text-gray-500 text-sm font-medium">{club.description}</p>
                                                </div>
                                                <Link href={`/dashboard/admin/clubs/${club.id}`} className="px-8 py-3 bg-primary text-white hover:bg-primary-hover rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                                    Review
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="glass-card p-16 text-center rounded-[2rem] border-dashed border-white/5">
                                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Verification Queue Empty</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="glass-card p-8 rounded-[2rem] bg-white/[0.02]">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Directory</h3>
                            <p className="text-sm text-gray-500 font-medium mb-8">Explore all verified campus communities and student organizations.</p>
                            <Link href="/dashboard/clubs" className="w-full inline-block text-center px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-white">
                                Browse Clubs
                            </Link>
                        </div>

                        <div className="glass-card p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Account Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Alerts</span>
                                    <span className="text-green-500">Live</span>
                                </div>
                                {profile.role === 'student' && (
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                        <span className="text-gray-500">Active Clubs</span>
                                        <span className="text-white">{data.clubCount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="text-white">{new Date(profile.created_at).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
