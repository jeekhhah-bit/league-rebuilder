import { create } from 'zustand';
import type { Team, Player, Match, LeagueSettings, ArchivedLeague } from '@/types/league';

const STORAGE_KEY = 'atlantis-league-data';
const ARCHIVE_KEY = 'atlantis-archived-leagues';

const defaultTeams: Team[] = [
  { id: 'team1', name: 'Atlantis FC', coach: 'Poseidon', logo: '', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  { id: 'team2', name: 'Trident United', coach: 'Neptune', logo: '', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
];

const defaultSettings: LeagueSettings = {
  leagueName: 'COSMUS LEAGUE',
  maxMatches: 50,
  subtitle: '50 Matches • 2 Teams • 1 Champion',
};

interface LeagueState {
  teams: Team[];
  players: Player[];
  matches: Match[];
  settings: LeagueSettings;
  archivedLeagues: ArchivedLeague[];
  selectedHomeTeam: Team | null;
  selectedAwayTeam: Team | null;
  setTeams: (teams: Team[]) => void;
  setPlayers: (players: Player[]) => void;
  setMatches: (matches: Match[]) => void;
  setSettings: (settings: LeagueSettings) => void;
  setSelectedHomeTeam: (team: Team | null) => void;
  setSelectedAwayTeam: (team: Team | null) => void;
  addMatch: (homeGoals: number, awayGoals: number, scorers?: { playerId: string; goals: number }[]) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  editPlayer: (id: string, data: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  updateTeamLogo: (teamId: string, logo: string) => void;
  updateTeamInfo: (teamId: string, data: Partial<Team>) => void;
  archiveLeague: () => void;
  resetLeague: () => void;
}

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return { teams: defaultTeams, players: [], matches: [], settings: defaultSettings };
};

const loadArchives = (): ArchivedLeague[] => {
  try {
    const saved = localStorage.getItem(ARCHIVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading archives:', e);
  }
  return [];
};

const saveState = (state: { teams: Team[]; players: Player[]; matches: Match[]; settings: LeagueSettings }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
};

const saveArchives = (archives: ArchivedLeague[]) => {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archives));
  } catch (e) {
    console.error('Error saving archives:', e);
  }
};

const initialState = loadState();
const initialArchives = loadArchives();

export const useLeagueStore = create<LeagueState>((set, get) => ({
  teams: initialState.teams,
  players: initialState.players || [],
  matches: initialState.matches || [],
  settings: initialState.settings || defaultSettings,
  archivedLeagues: initialArchives,
  selectedHomeTeam: null,
  selectedAwayTeam: null,

  setTeams: (teams) => { const s = get(); const ns = { teams, players: s.players, matches: s.matches, settings: s.settings }; saveState(ns); set({ teams }); },
  setPlayers: (players) => { const s = get(); const ns = { teams: s.teams, players, matches: s.matches, settings: s.settings }; saveState(ns); set({ players }); },
  setMatches: (matches) => { const s = get(); const ns = { teams: s.teams, players: s.players, matches, settings: s.settings }; saveState(ns); set({ matches }); },
  setSettings: (settings) => { const s = get(); const ns = { teams: s.teams, players: s.players, matches: s.matches, settings }; saveState(ns); set({ settings }); },
  setSelectedHomeTeam: (team) => set({ selectedHomeTeam: team }),
  setSelectedAwayTeam: (team) => set({ selectedAwayTeam: team }),

  addMatch: (homeGoals, awayGoals, scorers = []) => {
    const state = get();
    const homeTeam = state.selectedHomeTeam || state.teams[0];
    const awayTeam = state.selectedAwayTeam || state.teams[1];
    if (!homeTeam || !awayTeam || homeTeam.id === awayTeam.id) return;

    const homeWin = homeGoals > awayGoals;
    const draw = homeGoals === awayGoals;

    const updatedTeams = state.teams.map((t) => {
      if (t.id === homeTeam.id) {
        return { ...t, played: t.played + 1, won: t.won + (homeWin ? 1 : 0), drawn: t.drawn + (draw ? 1 : 0), lost: t.lost + (!homeWin && !draw ? 1 : 0), goalsFor: t.goalsFor + homeGoals, goalsAgainst: t.goalsAgainst + awayGoals, points: t.points + (homeWin ? 3 : draw ? 1 : 0) };
      }
      if (t.id === awayTeam.id) {
        return { ...t, played: t.played + 1, won: t.won + (!homeWin && !draw ? 1 : 0), drawn: t.drawn + (draw ? 1 : 0), lost: t.lost + (homeWin ? 1 : 0), goalsFor: t.goalsFor + awayGoals, goalsAgainst: t.goalsAgainst + homeGoals, points: t.points + (!homeWin && !draw ? 3 : draw ? 1 : 0) };
      }
      return t;
    });

    const updatedPlayers = state.players.map((p) => {
      const goal = scorers.find((s) => s.playerId === p.id);
      return goal ? { ...p, goals: p.goals + goal.goals } : p;
    });

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeTeamName: homeTeam.name,
      awayTeamName: awayTeam.name,
      homeGoals,
      awayGoals,
      scorers,
      date: new Date().toISOString(),
    };

    const newState = { teams: updatedTeams, players: updatedPlayers, matches: [...state.matches, newMatch], settings: state.settings };
    saveState(newState);
    set({ teams: updatedTeams, players: updatedPlayers, matches: newState.matches });
  },

  addPlayer: (playerData) => {
    const state = get();
    const newPlayer: Player = { ...playerData, id: `player-${Date.now()}` };
    const players = [...state.players, newPlayer];
    const ns = { teams: state.teams, players, matches: state.matches, settings: state.settings };
    saveState(ns);
    set({ players });
  },

  editPlayer: (id, data) => {
    const state = get();
    const players = state.players.map((p) => p.id === id ? { ...p, ...data } : p);
    const ns = { teams: state.teams, players, matches: state.matches, settings: state.settings };
    saveState(ns);
    set({ players });
  },

  deletePlayer: (id) => {
    const state = get();
    const players = state.players.filter((p) => p.id !== id);
    const ns = { teams: state.teams, players, matches: state.matches, settings: state.settings };
    saveState(ns);
    set({ players });
  },

  updateTeamLogo: (teamId, logo) => {
    const state = get();
    const teams = state.teams.map((t) => t.id === teamId ? { ...t, logo } : t);
    const ns = { teams, players: state.players, matches: state.matches, settings: state.settings };
    saveState(ns);
    set({ teams });
  },

  updateTeamInfo: (teamId, data) => {
    const state = get();
    const teams = state.teams.map((t) => t.id === teamId ? { ...t, ...data } : t);
    const ns = { teams, players: state.players, matches: state.matches, settings: state.settings };
    saveState(ns);
    set({ teams });
  },

  archiveLeague: () => {
    const state = get();
    const sortedTeams = [...state.teams].sort((a, b) => {
      const pa = a.won * 3 + a.drawn;
      const pb = b.won * 3 + b.drawn;
      if (pb !== pa) return pb - pa;
      return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
    });

    const archive: ArchivedLeague = {
      id: `league-${Date.now()}`,
      leagueName: state.settings.leagueName,
      subtitle: state.settings.subtitle,
      maxMatches: state.settings.maxMatches,
      teams: state.teams,
      players: state.players,
      matches: state.matches,
      archivedAt: new Date().toISOString(),
      champion: sortedTeams[0]?.name || null,
    };

    const archives = [...state.archivedLeagues, archive];
    saveArchives(archives);

    // Reset to fresh league
    const freshTeams = state.teams.map(t => ({ ...t, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }));
    const freshState = { teams: freshTeams, players: [], matches: [], settings: state.settings };
    saveState(freshState);
    set({ ...freshState, archivedLeagues: archives });
  },

  resetLeague: () => {
    const state = get();
    const freshTeams = state.teams.map(t => ({ ...t, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }));
    const ns = { teams: freshTeams, players: [], matches: [], settings: state.settings };
    saveState(ns);
    set(ns);
  },
}));
