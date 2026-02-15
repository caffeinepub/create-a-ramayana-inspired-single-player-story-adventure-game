# Specification

## Summary
**Goal:** Add a playable character system to the street-fighting game, including selection UI and persistence (profile + save/load), and show the chosen character during gameplay.

**Planned changes:**
- Create a dedicated frontend module that defines a reusable list of at least 3 predefined playable characters (stable characterId, English name, English bio, and portrait path under `/assets/generated/`).
- Add a character selection UX accessible from the Start screen with a clear selected state and a “Confirm Character” action; block starting a new game until a character is selected with an English prompt.
- Extend the backend user profile to store `characterId`, update the profile setup flow to collect and validate both fighter name and character selection, and handle existing users who have no saved `characterId` without crashing (prompt to select and save/update).
- Display the selected character’s name and portrait in the gameplay UI (HUD and/or chapter screen) without changing existing story/chapter/choice/challenge structure.
- Include `characterId` in saved progress so it round-trips through save/load; ensure older saves without `characterId` don’t crash and default to a valid character with a prompt to confirm/save if needed.
- Add any new character portrait image files under `frontend/public/assets/generated/` and ensure all references use absolute paths starting with `/assets/generated/`.

**User-visible outcome:** Players can pick a character before starting, see their chosen fighter (name + portrait) during gameplay, and have that choice persist across profile setup, saving/loading, and returning sessions.
