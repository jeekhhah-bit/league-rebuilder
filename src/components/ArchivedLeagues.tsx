import { useState } from 'react';
import { useLeagueStore } from '@/store/leagueStore';
import { Trophy, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import type { ArchivedLeague } from '@/types/league';

export function ArchivedLeagues() {
  const { archivedLeagues } = useLeagueStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (archivedLeagues.length === 0) {
    return (
      <div className="atlantis-card p-6 md:p-8 animate-fade-in text-center">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-display font-semibold mb-2 text-muted-foreground">
          No Archived Leagues
        </h2>
        <p className="text-sm text-muted-foreground">
          When a league ends and is archived, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-semibold glow-text text-primary text-center mb-6">
        League Archives
      </h2>
      {[...archivedLeagues].reverse().map((league) => (
        <ArchivedLeagueCard
          key={league.id}
          league={league}
          isExpanded={expandedId === league.id}
          onToggle={() => setExpandedId(expandedId === league.id ? null : league.id)}
        />
      ))}
    </div>
  );
}

function ArchivedLeagueCard({
  league,
  isExpanded,
  onToggle,
}: {
  league: ArchivedLeague;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const archivedDate = new Date(league.archivedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="atlantis-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gold" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-lg md:text-xl">{league.leagueName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{archivedDate}</span>
              {league.champion && (
                <span className="text-gold">• Champion: {league.champion}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">{league.matches.length} matches</span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 md:px-6 pb-6 space-y-4 border-t border-border/50">
          <div className="pt-4 grid lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <StandingsTable teams={league.teams} readOnly />
              <MatchHistory matches={league.matches} teams={league.teams} />
            </div>
            <TopScorers players={league.players} teams={league.teams} hideButtons />
          </div>
        </div>
      )}
    </div>
  );
}
