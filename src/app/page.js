import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createSupabaseServer();

  // Fetch only published events from approved clubs
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      clubs (
        name
      )
    `)
    .eq('status', 'published')
    .order('event_date', { ascending: true })
    .limit(6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full animate-fade-in">
            Centralized Campus Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Never Miss another <br />
            <span className="gradient-text">Campus Event</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The official platform for all college clubs, tech talks, and seminars.
            Verified information, directly from the authorized source.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth/register" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/25">
              Get Started
            </Link>
            <Link href="#events" className="w-full sm:w-auto glass-card hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Upcoming Events</h2>
              <p className="text-gray-400">Discover what's happening around campus</p>
            </div>
            <Link href="/dashboard" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline transition-all">
              View All
            </Link>
          </div>

          {!events || events.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border-dashed border-white/10">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">No upcoming events found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Check back later for new seminars, workshops, and club activities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group border-white/5 bg-black/40">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        {event.clubs?.name}
                      </span>
                      <span className="text-gray-500 text-xs font-medium">
                        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-white">{event.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                      {event.description}
                    </p>
                  </div>
                  <div className="mt-auto p-6 pt-0 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center text-xs text-gray-500 gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <Link href={`/dashboard/events/${event.id}`} className="text-sm font-bold text-white hover:text-primary transition-colors">
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats/Clubs Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">Verified Communities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl glass-card">
              <div className="text-4xl font-bold gradient-text mb-2">20+</div>
              <div className="text-gray-400 text-sm font-medium">Clubs</div>
            </div>
            <div className="p-8 rounded-2xl glass-card">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-gray-400 text-sm font-medium">Students</div>
            </div>
            <div className="p-8 rounded-2xl glass-card">
              <div className="text-4xl font-bold gradient-text mb-2">100+</div>
              <div className="text-gray-400 text-sm font-medium">Events Yearly</div>
            </div>
            <div className="p-8 rounded-2xl glass-card">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-400 text-sm font-medium">Verified Info</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

