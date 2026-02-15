// Character definitions for the street fighting game
export interface Character {
  characterId: string;
  name: string;
  bio: string;
  portraitPath: string;
}

export const CHARACTERS: Character[] = [
  {
    characterId: 'iron-fist',
    name: 'Iron Fist',
    bio: 'A relentless brawler from the docks. Known for devastating punches and an iron will that never breaks.',
    portraitPath: '/assets/generated/streetfighter-char-1-portrait.dim_768x768.png',
  },
  {
    characterId: 'shadow-blade',
    name: 'Shadow Blade',
    bio: 'Swift and deadly, this fighter strikes from the shadows. Speed and precision are their weapons.',
    portraitPath: '/assets/generated/streetfighter-char-2-portrait.dim_768x768.png',
  },
  {
    characterId: 'thunder-kick',
    name: 'Thunder Kick',
    bio: 'A martial arts master with lightning-fast kicks. Discipline and honor guide every move.',
    portraitPath: '/assets/generated/streetfighter-char-3-portrait.dim_768x768.png',
  },
];

export const DEFAULT_CHARACTER_ID = 'iron-fist';

export function getCharacterById(characterId: string): Character | undefined {
  return CHARACTERS.find((char) => char.characterId === characterId);
}

export function getCharacterByIdOrDefault(characterId: string | undefined): Character {
  if (!characterId) {
    return CHARACTERS[0];
  }
  return getCharacterById(characterId) || CHARACTERS[0];
}
