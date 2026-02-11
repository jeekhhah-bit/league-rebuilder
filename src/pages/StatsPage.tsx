import { Navbar } from '@/components/Navbar';
import { useLeagueStore } from '@/store/leagueStore';
import { BarChart3, TrendingUp, Zap, Goal } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatsPage = () => {
  const { teams, players, matches, settings, archivedLeagues } = useLeagueStore();

  const totalMatchesAllTime = archivedLeagues.reduce((sum, l) => sum + l.matches.length, 0) + matches.length;
  const totalGoalsAllTime = archivedLeagues.reduce((sum, l) => sum + l.matches.reduce((s, m) => s + m.homeGoals + m.awayGoals, 0), 0) + matches.reduce((s, m) => s + m.homeGoals + m.awayGoals, 0);
  const totalSeasonsPlayed = archivedLeagues.length + (matches.length > 0 ? 1 : 0);
  const avgGoalsPerMatch = totalMatchesAllTime > 0 ? (totalGoalsAllTime / totalMatchesAllTime).toFixed(1) : '0';

  // Current season stats
  const currentTotalGoals = matches.reduce((s, m) => s + m.homeGoals + m.awayGoals, 0);
  const biggestWin = matches.reduce((best, m) => {
    const diff = Math.abs(m.homeGoals - m.awayGoals);
    return diff > best.diff ? { match: m, diff } : best;
  }, { match: null as any, diff: 0 });

  const highestScoringMatch = matches.reduce((best, m) => {
    const total = m.homeGoals + m.awayGoals;
    return total > best.total ? { match: m, total } : best;
  }, { match: null as any, total: 0 });

  const draws = matches.filter(m => m.homeGoals === m.awayGoals).length;
  const cleanSheets = matches.filter(m => m.homeGoals === 0 || m.awayGoals === 0).length;

  // Win streaks per team
  const getWinStreak = (teamId: string) => {
    let max = 0, current = 0;
    matches.forEach(m => {
      const isHome = m.homeTeamId === teamId;
      const isAway = m.awayTeamId === teamId;
      if (!isHome && !isAway) return;
      const won = (isHome && m.homeGoals > m.awayGoals) || (isAway && m.awayGoals > m.homeGoals);
      if (won) { current++; max = Math.max(max, current); }
      else { current = 0; }
    });
    return max;
  };

  const statCards = [
    { label: 'Total Seasons', value: totalSeasonsPlayed, icon: TrendingUp, color: 'text-primary' },
    { label: 'All-Time Matches', value: totalMatchesAllTime, icon: Zap, color: 'text-gold' },
    { label: 'All-Time Goals', value: totalGoalsAllTime, icon: Goal, color: 'text-coral' },
    { label: 'Avg Goals/Match', value: avgGoalsPerMatch, icon: BarChart3, color: 'text-secondary' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-teal">
                Statistics
              </h1>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Deep dive into the numbers. Every goal, every record, every stat that matters.
            </p>
          </div>

          {/* Global Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 animate-fade-in">
            {statCards.map((stat) => (
              <div key={stat.label} className="atlantis-card p-4 md:p-6 text-center">
                <stat.icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
                <p className="text-2xl md:text-3xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Current Season Details */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Current Season Overview */}
            <div className="atlantis-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg md:text-xl font-display font-semibold mb-4 glow-text text-primary">
                Current Season
              </h2>
              <div className="space-y-4">
                <StatRow label="Matches Played" value={`${matches.length}/${settings.maxMatches}`} />
                <StatRow label="Total Goals" value={currentTotalGoals} />
                <StatRow label="Draws" value={draws} />
                <StatRow label="Clean Sheets" value={cleanSheets} />
                {teams.map(t => (
                  <StatRow key={t.id} label={`${t.name} Win Streak`} value={`${getWinStreak(t.id)} matches`} />
                ))}
              </div>
            </div>

            {/* Notable Matches */}
            <div className="atlantis-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg md:text-xl font-display font-semibold mb-4 text-gold">
                Notable Matches
              </h2>
              <div className="space-y-4">
                {biggestWin.match ? (
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
                    <p className="text-xs text-muted-foreground mb-1">🏆 Biggest Victory</p>
                    <p className="font-semibold text-sm">
                      {biggestWin.match.homeTeamName} {biggestWin.match.homeGoals} - {biggestWin.match.awayGoals} {biggestWin.match.awayTeamName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{biggestWin.diff} goal difference</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No matches recorded yet.</p>
                )}
                {highestScoringMatch.match && highestScoringMatch.total > 0 && (
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
                    <p className="text-xs text-muted-foreground mb-1">⚡ Highest Scoring</p>
                    <p className="font-semibold text-sm">
                      {highestScoringMatch.match.homeTeamName} {highestScoringMatch.match.homeGoals} - {highestScoringMatch.match.awayGoals} {highestScoringMatch.match.awayTeamName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{highestScoringMatch.total} total goals</p>
                  </div>
                )}

                {/* Team Head-to-Head */}
                {teams.length >= 2 && matches.length > 0 && (
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/20">
                    <p className="text-xs text-muted-foreground mb-2">⚔️ Head to Head</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{teams[0].won}</p>
                        <p className="text-xs text-muted-foreground">{teams[0].name}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-muted-foreground">{draws}</p>
                        <p className="text-xs text-muted-foreground">Draws</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-secondary">{teams[1].won}</p>
                        <p className="text-xs text-muted-foreground">{teams[1].name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default StatsPage;
