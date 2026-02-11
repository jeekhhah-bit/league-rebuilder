import { useState } from 'react';
import { useLeagueStore } from '@/store/leagueStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface LeagueSettingsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeagueSettingsForm({ open, onOpenChange }: LeagueSettingsFormProps) {
  const { settings, teams, setSettings, updateTeamInfo } = useLeagueStore();

  const [leagueName, setLeagueName] = useState(settings.leagueName);
  const [maxMatches, setMaxMatches] = useState(settings.maxMatches);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [team1Name, setTeam1Name] = useState(teams[0]?.name || '');
  const [team1Coach, setTeam1Coach] = useState(teams[0]?.coach || '');
  const [team2Name, setTeam2Name] = useState(teams[1]?.name || '');
  const [team2Coach, setTeam2Coach] = useState(teams[1]?.coach || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings({ leagueName, maxMatches, subtitle });
    if (teams[0]) updateTeamInfo(teams[0].id, { name: team1Name, coach: team1Coach });
    if (teams[1]) updateTeamInfo(teams[1].id, { name: team2Name, coach: team2Coach });
    toast.success('League settings updated!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> League Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>League Name</Label>
            <Input value={leagueName} onChange={(e) => setLeagueName(e.target.value)} className="bg-input border-border" />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-input border-border" />
          </div>

          <div className="space-y-2">
            <Label>Max Matches</Label>
            <Input type="number" min={1} value={maxMatches} onChange={(e) => setMaxMatches(parseInt(e.target.value || '50') || 50)} className="bg-input border-border" />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-display text-sm text-primary mb-3">Team 1</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} className="bg-input border-border" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Coach</Label>
                <Input value={team1Coach} onChange={(e) => setTeam1Coach(e.target.value)} className="bg-input border-border" />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-display text-sm text-secondary mb-3">Team 2</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} className="bg-input border-border" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Coach</Label>
                <Input value={team2Coach} onChange={(e) => setTeam2Coach(e.target.value)} className="bg-input border-border" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Save Settings</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
