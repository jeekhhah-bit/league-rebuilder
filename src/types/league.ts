export interface Team {
  id: string;
  name: string;
  coach: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  image: string | null;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeGoals: number;
  awayGoals: number;
  scorers: { playerId: string; goals: number }[];
  date: string;
}

export interface LeagueSettings {
  leagueName: string;
  maxMatches: number;
  subtitle: string;
}

export interface ArchivedLeague {
  id: string;
  leagueName: string;
  subtitle: string;
  maxMatches: number;
  teams: Team[];
  players: Player[];
  matches: Match[];
  archivedAt: string;
  champion: string | null;
}
