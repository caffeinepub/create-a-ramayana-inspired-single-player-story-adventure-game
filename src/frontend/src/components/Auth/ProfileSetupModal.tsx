import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { CHARACTERS } from '../../game/characters/characters';
import { encodeCharacterId } from '../../game/characters/characterPersistence';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Enter your fighter name');
      return;
    }

    if (!selectedCharacterId) {
      toast.error('Choose your fighter');
      return;
    }

    try {
      await saveProfile.mutateAsync({ 
        name: name.trim(),
        characterId: encodeCharacterId(selectedCharacterId),
      });
      toast.success('Welcome to the streets!');
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Welcome, Fighter</DialogTitle>
          <DialogDescription>
            What do they call you on the streets? And who will you fight as?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Fighter Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Choose Your Fighter</Label>
            <div className="grid md:grid-cols-3 gap-3">
              {CHARACTERS.map((character) => {
                const isSelected = selectedCharacterId === character.characterId;
                return (
                  <Card
                    key={character.characterId}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-border'
                    }`}
                    onClick={() => setSelectedCharacterId(character.characterId)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="relative">
                        <img
                          src={character.portraitPath}
                          alt={character.name}
                          className="w-full aspect-square object-cover rounded-sm border border-border"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm font-display uppercase">{character.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">
                          {character.bio}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full font-bold" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Enter the Ring'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
