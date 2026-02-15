# Specification

## Summary
**Goal:** Convert the existing story-driven game into a gritty, urban-themed street fighting game with a new English storyline, updated UI theme, a new brawl-style challenge, and new street-fight image assets.

**Planned changes:**
- Replace Ramayana-inspired chapter narratives, names, and places with an original English street-fighting storyline while keeping the same chapter/mission structure and chapter count unless an extra chapter is needed for coherence.
- Update start screen and chapter screen player-facing text (titles, descriptions, labels, messaging) to match the street-fighting theme while keeping existing navigation and save/load + Internet Identity entry points intact.
- Retheme the UI from parchment/epic styling to a gritty urban aesthetic (concrete/metal, high-contrast neutrals, punchy non-blue/non-purple accents) across start screen, HUD, cards, buttons, mission status UI, and save/load panel.
- Add a street-fight-appropriate interactive challenge (e.g., timing/combo/QTE-style mini-game) and integrate it into the existing challenge selection/completion flow so chapter progression can depend on it.
- Add and wire up new static street-fighting image assets under `frontend/public/assets/generated` (title background, chapter backgrounds, character/scene illustration set, city map) and update all references to avoid missing assets.

**User-visible outcome:** Players see a street-fighting themed game (story, visuals, and UI), progress through urban fight chapters with choices and objectives, and complete at least one new brawl-style challenge to advance—while save/load and Internet Identity flows continue to work as before.
