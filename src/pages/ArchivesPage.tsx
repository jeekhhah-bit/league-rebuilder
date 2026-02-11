import { Navbar } from '@/components/Navbar';
import { ArchivedLeagues } from '@/components/ArchivedLeagues';
import { Scroll } from 'lucide-react';

const ArchivesPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <Scroll className="w-8 h-8 text-gold" />
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold">
                League Archives
              </h1>
              <Scroll className="w-8 h-8 text-gold" />
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Relive the glory of past seasons. Every match, every goal, every champion preserved forever in the depths.
            </p>
          </div>
          <ArchivedLeagues />
        </div>
      </div>
    </>
  );
};

export default ArchivesPage;
