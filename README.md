# AstroSnax — Quiet Sky Garden (merge stub)

Expo (React Native + TypeScript) app. This branch adds a **playable merge-board stub** as the home **Garden** tab (`/`), alongside the existing Today / Archive / About content.

## Run

```bash
pnpm install
npx expo start
```

Then open in iOS Simulator, Android emulator, or Expo Go.

## What works in the stub

- **Garden tab (home `/`)** — 5×5 merge board is the home surface
- **Drag pieces** with `react-native-gesture-handler` (Reanimated motion)
- **Merge** two matching tiers into the next tier along an 8-step chain
- **Add spark** places a new lowest-tier piece in an empty cell
- **Reset** clears AsyncStorage and restores the starter layout
- **Local persistence** via `@react-native-async-storage/async-storage`
- **Content pack** at `content/packs/astrology-merge.json` (theme-swappable later)

Placeholder astrology-flavored chain: Spark → Ember → Crescent → Orbit → Constellation → Horizon → Nova → Eclipse.

## Intentionally not built yet

- Match-3 levels (deferred feeder loop)
- Rewarded ads / IAP
- Custom art beyond simple colored shapes

## Stack notes

- Managed Expo + TypeScript + Expo Router
- Merge UI: View/Flex grid + gesture-handler pan (no Skia)
- Existing AstroSnax tabs and Contentful content remain available under Today / Archive / About
