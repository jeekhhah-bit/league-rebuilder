import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Scroll, BarChart3, Crown, Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLeagueStore } from '@/store/leagueStore';

const navItems = [
  { title: 'League', path: '/', icon: Trophy },
  { title: 'Archives', path: '/archives', icon: Scroll },
  { title: 'Hall of Fame', path: '/hall-of-fame', icon: Crown },
  { title: 'Stats', path: '/stats', icon: BarChart3 },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { settings } = useLeagueStore();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl bg-background/70">
        <div className="container mx-auto px-4 flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-display text-sm md:text-base font-semibold text-gradient-gold tracking-wider hidden sm:inline">
              {settings.leagueName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 border-t border-border/20',
            mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container mx-auto px-4 py-3 space-y-1 bg-background/95 backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="h-14 md:h-16" />
    </>
  );
}
