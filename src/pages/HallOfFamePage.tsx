import { Navbar } from '@/components/Navbar';
import { useLeagueStore } from '@/store/leagueStore';
import { Crown, Trophy, Target, Flame, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Player, Team, ArchivedLeague } from '@/types/league';

interface AggregatedPlayer {
  name: string;
  totalGoals: number;
  leaguesPlayed: number;
  image: string | null;
}

interface ChampionRecord {
  teamName: string;
  titles: number;
  leagues: string[];
}

const HallOfFamePage = () => {
  const { archivedLeagues, players: currentPlayers, teams: currentTeams } = useLeagueStore();

  // Aggregate all-time top scorers across all archived leagues + current
  const allTimeScorerMap = new Map<string, AggregatedPlayer>();

  const processPlayers = (players: Player[]) => {
    players.forEach((p) => {
      const existing = allTimeScorerMap.get(p.name) || { name: p.name, totalGoals: 0, leaguesPlayed: 0, image: p.image };
      existing.totalGoals += p.goals || 0;
      existing.leaguesPlayed += 1;
      if (p.image) existing.image = p.image;
      allTimeScorerMap.set(p.name, existing);
    });
  };

  archivedLeagues.forEach((league) => processPlayers(league.players));
  processPlayers(currentPlayers);

  const allTimeScorers = Array.from(allTimeScorerMap.values())
    .sort((a, b) => b.totalGoals - a.totalGoals)
    .slice(0, 10);

  // Champion records
  const championMap = new Map<string, ChampionRecord>();
  archivedLeagues.forEach((league) => {
    if (league.champion) {
      const existing = championMap.get(league.champion) || { teamName: league.champion, titles: 0, leagues: [] };
      existing.titles += 1;
      existing.leagues.push(league.leagueName);
      championMap.set(league.champion, existing);
    }
  });
  const champions = Array.from(championMap.values()).sort((a, b) => b.titles - a.titles);

  // Most goals in a single league
  const leagueRecords: { leagueName: string; topScorer: string; goals: number; date: string }[] = [];
  archivedLeagues.forEach((league) => {
    const topPlayer = [...league.players].sort((a, b) => (b.goals || 0) - (a.goals || 0))[0];
    if (topPlayer) {
      leagueRecords.push({
        leagueName: league.leagueName,
        topScorer: topPlayer.name,
        goals: topPlayer.goals || 0,
        date: new Date(league.archivedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      });
    }
  });

  const hasData = archivedLeagues.length > 0 || currentPlayers.length > 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-gold" />
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold">
                Hall of Fame
              </h1>
              <Crown className="w-8 h-8 text-gold" />
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The legends who shaped the league. All-time records across every season.
            </p>
          </div>

          {!hasData ? (
            <div className="atlantis-card p-12 text-center">
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h2 className="text-xl font-display text-muted-foreground mb-2">No Legends Yet</h2>
              <p className="text-sm text-muted-foreground">Play matches and archive leagues to build the Hall of Fame.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Champions */}
              {champions.length > 0 && (
                <div className="atlantis-card p-6 md:p-8 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-6 h-6 text-gold" />
                    <h2 className="text-xl md:text-2xl font-display font-semibold text-gradient-gold">
                      Champions
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {champions.map((champ, i) => (
                      <div key={champ.teamName} className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border transition-all',
                        i === 0 ? 'border-gold/30 bg-gold/5' : 'border-border/30 bg-muted/10'
                      )}>
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0',
                          i === 0 ? 'bg-gold/20 text-gold' : 'bg-muted/30 text-muted-foreground'
                        )}>
                          {champ.titles}×
                        </div>
                        <div>
                          <p className="font-semibold">{champ.teamName}</p>
                          <p className="text-xs text-muted-foreground">{champ.titles} title{champ.titles > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All-Time Top Scorers */}
              {allTimeScorers.length > 0 && (
                <div className="atlantis-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-6 h-6 text-primary" />
                    <h2 className="text-xl md:text-2xl font-display font-semibold glow-text text-primary">
                      All-Time Top Scorers
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {allTimeScorers.map((player, index) => (
                      <div key={player.name} className={cn(
                        'flex items-center gap-4 p-3 md:p-4 rounded-lg transition-all',
                        index < 3 ? 'bg-muted/20' : 'hover:bg-muted/10'
                      )}>
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                          index === 0 && 'bg-gold text-primary-foreground',
                          index === 1 && 'bg-muted-foreground text-primary-foreground',
                          index === 2 && 'bg-coral text-primary-foreground',
                          index > 2 && 'bg-muted text-muted-foreground'
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.leaguesPlayed} season{player.leaguesPlayed > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-gold">{player.totalGoals}</p>
                          <p className="text-xs text-muted-foreground">goals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Season Records */}
              {leagueRecords.length > 0 && (
                <div className="atlantis-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Flame className="w-6 h-6 text-coral" />
                    <h2 className="text-xl md:text-2xl font-display font-semibold text-coral">
                      Season Top Scorers
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {leagueRecords.map((record, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{record.leagueName}</p>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm text-foreground">{record.topScorer}</span>
                          <span className="text-lg font-bold text-gold">{record.goals}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HallOfFamePage;
