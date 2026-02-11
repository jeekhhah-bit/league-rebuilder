import { AdminProvider } from '@/contexts/AdminContext';
import { LeagueHeader } from '@/components/LeagueHeader';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import { ArchivedLeagues } from '@/components/ArchivedLeagues';
import heroBg from '@/assets/hero-bg.jpg';

const VisitorPage = () => {
  return (
    <AdminProvider isAdmin={false}>
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Hero section with background image */}
        <div className="relative w-full h-screen">
          <img
            src={heroBg}
            alt="Ocean background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-background/60" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <LeagueHeader />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-12 max-w-full overflow-x-hidden">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6 min-w-0">
              <StandingsTable />
              <MatchHistory />
            </div>
            <div className="min-w-0">
              <TopScorers hideButtons />
            </div>
          </div>

          {/* Archived Leagues Section */}
          <div className="mt-12">
            <ArchivedLeagues />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default VisitorPage;
