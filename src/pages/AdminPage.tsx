import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AdminProvider } from '@/contexts/AdminContext';
import { LeagueHeader } from '@/components/LeagueHeader';
import { StandingsTable } from '@/components/StandingsTable';
import { TopScorers } from '@/components/TopScorers';
import { MatchHistory } from '@/components/MatchHistory';
import { PlayerForm } from '@/components/PlayerForm';
import { MatchForm } from '@/components/MatchForm';
import { TeamLogoUploader } from '@/components/TeamLogoUploader';
import { LeagueSettingsForm } from '@/components/LeagueSettingsForm';
import { Button } from '@/components/ui/button';
import { useLeagueStore } from '@/store/leagueStore';
import { UserPlus, Play, RotateCcw, Settings, Archive } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import heroBg from '@/assets/hero-bg.jpg';

const AdminPage = () => {
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [matchFormOpen, setMatchFormOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const { matches, settings, resetLeague, archiveLeague } = useLeagueStore();

  const handleEditPlayer = (playerId: string) => {
    setEditingPlayerId(playerId);
    setPlayerFormOpen(true);
  };

  const handlePlayerFormClose = (open: boolean) => {
    setPlayerFormOpen(open);
    if (!open) setEditingPlayerId(null);
  };

  const handleArchive = () => {
    archiveLeague();
    toast.success('League archived! A new league has begun.');
  };

  return (
    <AdminProvider isAdmin={true}>
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <Navbar />

        {/* Hero section */}
        <div className="relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]">
          <img
            src={heroBg}
            alt="Ocean background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-background/60" />

          <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <LeagueHeader />
            <div className="flex flex-wrap justify-center gap-3 mt-8 mb-12 -translate-y-4 px-4">
              <Button onClick={() => setSettingsOpen(true)} className="gap-2" variant="outline">
                <Settings className="w-4 h-4" /> Settings
              </Button>
              <Button onClick={() => setPlayerFormOpen(true)} className="gap-2" variant="outline">
                <UserPlus className="w-4 h-4" /> Add Player
              </Button>
              <Button
                onClick={() => setMatchFormOpen(true)}
                className="gap-2"
                disabled={matches.length >= settings.maxMatches}
              >
                <Play className="w-4 h-4" /> Record Match ({matches.length}/{settings.maxMatches})
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <Archive className="w-4 h-4" /> Archive League
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">Archive This League?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will save the current league to archives and start a fresh new league. All current data will be preserved in the archives.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive}>Archive & Start New</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">Reset League?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all matches, players, and reset team stats. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetLeague}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pb-12 max-w-full">
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-6 min-w-0">
              <StandingsTable />
              <TeamLogoUploader />
              <MatchHistory />
            </div>
            <TopScorers onEditPlayer={handleEditPlayer} />
          </div>
        </div>

        <PlayerForm open={playerFormOpen} onOpenChange={handlePlayerFormClose} editingPlayerId={editingPlayerId} />
        <MatchForm open={matchFormOpen} onOpenChange={setMatchFormOpen} />
        <LeagueSettingsForm open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </AdminProvider>
  );
};

export default AdminPage;
