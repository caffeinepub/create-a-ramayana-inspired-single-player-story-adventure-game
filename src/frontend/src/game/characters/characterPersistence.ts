// Utilities to convert between stable string characterId (UI) and bigint (backend)

import { CHARACTERS, DEFAULT_CHARACTER_ID } from './characters';

// Map stable string IDs to bigint indices for backend storage
export function encodeCharacterId(characterId: string): bigint {
  const index = CHARACTERS.findIndex((char) => char.characterId === characterId);
  return BigInt(index >= 0 ? index : 0);
}

// Map bigint indices from backend to stable string IDs
export function decodeCharacterId(characterIdBigInt: bigint): string {
  const index = Number(characterIdBigInt);
  if (index >= 0 && index < CHARACTERS.length) {
    return CHARACTERS[index].characterId;
  }
  return DEFAULT_CHARACTER_ID;
}

// Validate and return a safe character ID
export function validateCharacterId(characterId: string | undefined): string {
  if (!characterId) {
    return DEFAULT_CHARACTER_ID;
  }
  const exists = CHARACTERS.some((char) => char.characterId === characterId);
  return exists ? characterId : DEFAULT_CHARACTER_ID;
}
