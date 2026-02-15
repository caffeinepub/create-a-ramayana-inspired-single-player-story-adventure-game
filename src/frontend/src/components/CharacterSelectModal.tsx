import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CHARACTERS, type Character } from '../game/characters/characters';
import { CheckCircle2 } from 'lucide-react';

interface CharacterSelectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (characterId: string) => void;
  initialSelection?: string;
}

export default function CharacterSelectModal({
  open,
  onClose,
  onConfirm,
  initialSelection,
}: CharacterSelectModalProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    initialSelection || null
  );

  const handleConfirm = () => {
    if (selectedCharacterId) {
      onConfirm(selectedCharacterId);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase">Choose Your Fighter</DialogTitle>
          <DialogDescription>
            Select the fighter who will represent you in the streets.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 py-4">
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
                <CardContent className="p-4 space-y-3">
                  <div className="relative">
                    <img
                      src={character.portraitPath}
                      alt={character.name}
                      className="w-full aspect-square object-cover rounded-sm border border-border"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-display uppercase">{character.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {character.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCharacterId}>
            Confirm Fighter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
