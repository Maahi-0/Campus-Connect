import { createSupabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ClubDirectory() {
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // Fetch approved clubs with their member count
    const { data: clubs, error } = await supabase
        .from('clubs')
        .select(`
      *,
      club_members (count)
    `)
        .eq('is_approved', true);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-2 gradient-text">Club Directory</h1>
                <p className="text-gray-400">Explore and join verified campus communities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs?.length > 0 ? (
                    clubs.map(club => (
                        <Link key={club.id} href={`/dashboard/clubs/${club.id}`} className="glass-card p-8 rounded-3xl group hover:border-primary/50 transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                    {club.club_members[0]?.count || 0} Members
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{club.name}</h3>
                            <p className="text-gray-400 text-sm mb-8 flex-grow">
                                {club.description}
                            </p>

                            <div className="pt-6 border-t border-white/5 mt-auto">
                                <span className="text-sm font-bold text-primary inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                    View Club Profile &rarr;
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full glass-card p-16 text-center rounded-3xl border-dashed">
                        <div className="text-5xl mb-6">🔍</div>
                        <h3 className="text-xl font-bold text-white">No verified clubs yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Check back soon! Our admins are working on verifying campus communities.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
