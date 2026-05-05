# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

The "PIP-BOY 3000" themed variant of the OFM/OHM interactive map frontend — a Fallout-flavored skin over the same map+timeline UI shared by the sibling apps in `../` (`ohm-map`, `ofm-map-2`, `lcars-map`, `lcars-map-2`, `rock_of_bral_upper`). The Angular project name in `package.json` / `angular.json` is still `ohm-map` (legacy), only the index.html title, styles, and assets are pip-boy specific. Recent git history shows a merge from `openfantasymap/cbrpnk-map`, so the cyberpunk codebase is the upstream and you'll see `CbrpnkService` (scanline effect toggle) carried over.

See `/srv/ofm/CLAUDE.md` for the larger OFM platform (backend services, world data, etc.) — this file only covers what's specific to pipboy-map.

## Stack

- **Angular 21** with NgModule (not standalone — every declaration is marked `standalone: false` because v21's default flipped). `bootstrapModule(AppModule)` in `src/main.ts`.
- **Build**: `@angular/build:application` (esbuild-based). No more webpack `browser` builder, no more separate `polyfills.ts` (it's the `polyfills` array in `angular.json`).
- **Material 21** with the `magenta-violet` prebuilt theme (the old `pink-bluegrey` was removed in the v15 MDC migration).
- **TypeScript 5.9** in non-strict mode — the legacy code is loaded with implicit-any and missing null checks; flipping strict on cascades into a rewrite, so it's intentionally off in `tsconfig.json`.
- **RxJS 7.8**, zone.js 0.15.
- **Karma + Jasmine** still wired up (`@angular/build:karma`), but there are no actual specs — the auto-generated stubs were deleted because they tested non-existent fields.
- No linter wired up. The original TSLint config is gone (TSLint was deprecated in 2020). If you want one, `ng add @angular-eslint/schematics`.
- No e2e (Protractor was removed; nothing replaced it).

## Commands

```bash
npm install
npm start                # ng serve, dev server on :4200
npm run build            # production build → dist/ohm-map/browser
npm test                 # karma; will pass with zero specs

# Docker (multi-stage: Node 22 build → nginx serve)
./build.sh               # buildx + push ofdistantworlds/pipboy-map:latest
docker run --rm -p 8080:80 \
  -e TILESERVER=http://... \
  -e TAG=... \
  ofdistantworlds/pipboy-map:latest
```

Production budgets in `angular.json`: 2mb warn / 5mb error initial bundle, 8kb / 16kb per component style.

## Runtime configuration

Environment variables become `src/assets/env.json` at container start, **not** at build time. `docker-entrypoint.sh` runs `jq -n env > ./assets/env.json`, so every process env var ends up readable from the browser.

The mechanism: `EnvService` (`src/app/env.service.ts`) is preloaded by an `provideAppInitializer` in `AppModule` — it fetches `/assets/env.json` once at bootstrap and exposes `getEnv(key)` synchronously after that. `MapComponent` calls `this.ds.getEnv('TILESERVER')` in `ngOnInit`. **Do not** import `assets/env.json` statically — that bakes in the build-time copy and bypasses the runtime overwrite.

Recognized keys:
- `TILESERVER` — base URL for the tile/events server (default points at `51.15.160.236:9034`).
- `TAG` — when set, appended as `?tag=<TAG>` to `timelines.json` and `tags.json` requests against `static.fantasymaps.org` (used to scope the app to a curated world subset).

The `OfmService.getTimelines()` / `getTags()` paths still re-fetch `/assets/env.json` directly because they need the `TAG` value at request time; that's fine, just don't conflate the two patterns.

## Service layer

Two HTTP services with an inheritance relationship:

- `OhmService` (`src/app/ohm.service.ts`) — base. Talks to `51.15.160.236:9034` (events), `api.stats.openhistorymap.org` (stats), `su.openhistorymap.org` (URL shortener).
- `OfmService extends OhmService` (`src/app/ofm.service.ts`) — adds the fantasy-maps endpoints: `static.fantasymaps.org/{world}/map.json`, `events.json`, `search`, plus the global `timelines.json` / `tags.json`. Overrides `getEvents` to hit fantasymaps instead of OHM.

Components inject `OfmService` to get the union of both. If you add a new endpoint, decide whether it's OHM-generic or OFM-specific and put it on the right class.

`CbrpnkService` is a single `EventEmitter<boolean>` for toggling the scanline overlay — leftover from the cyberpunk parent theme. The map component subscribes to it.

## Map rendering

**MapLibre GL 5**, `@turf/turf@7`, and `vis-timeline` are loaded from **unpkg CDNs in `src/index.html`**, not as npm dependencies. They're referenced in `map.component.ts` via `declare const maplibregl; declare const vis; declare const turf;`. If you bump versions, edit `index.html` — `package.json` won't help. The `@turf/distance` and `@turf/length` npm entries in `package.json` exist but the runtime uses the CDN bundle.

There's no `accessToken` on MapLibre (it's not Mapbox) — don't reintroduce one.

## Sibling apps

When changing shared behavior, check whether the equivalent file exists in `../ofm-map-2/`, `../ohm-map/`, `../lcars-map*/`, etc. They drift independently (different Angular versions, different theme assets) — there is no shared library, so changes have to be ported by hand. The map.component, services, and pipes are the most likely to be near-duplicates across siblings.
