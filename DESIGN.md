# Design Brief

## Tone
Celine-inspired luxury dark academia. Intellectually serious, editorial precision, high-fashion minimalism without sentimentality. Clinical and composed, never decorative.

## Differentiation
Uncompromising dark-academic luxury. Every pixel intentional. Surgical palette (black/white/gray), zero decoration, 1px borders, aggressive whitespace. Serious learners only.

## Color Palette (Dark Mode Primary)

| Token | OKLCH | Purpose |
|-------|-------|---------|
| Background | `0.08 0 0` | Near-black surface (#0A0A0A) |
| Foreground | `0.96 0 0` | Off-white text (#F5F5F0) |
| Card | `0.12 0 0` | Elevated surface, case dossiers |
| Border | `0.20 0 0` | 1px dividers, surgical precision |
| Muted | `0.25 0 0` | Secondary text, subtle hierarchy |
| Accent | `0.92 0 0` | Rare highlights, clinical only |
| Primary | `0.88 0 0` | Interactive outlines, invert on hover |
| Destructive | `0.50 0.15 24` | Clinical red, destructive actions |

Light mode inverted (bg `0.98`, fg `0.08`, etc.) for accessibility fallback.

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display | Instrument Serif (Italic) | Headings, case titles, wide letter-spacing on uppercase |
| Body | Plus Jakarta Sans | Editorial text, generous line height, 1.6em default |
| Mono | JetBrains Mono | Tags, labels, theory classifications, code snippets |

## Elevation & Depth
No shadows beyond `shadow-xs`. Depth through borders, background shifts, and vertical positioning only. Cards have `border-b` (1px), never lifted. Minimal top/bottom rules accent sections.

## Structural Zones

| Zone | Treatment | Example |
|------|-----------|---------|
| Header | Minimal top bar, "VILLAIN ARC" text logo (Instrument Serif italic), `border-b` (1px border) | Navigation, logo |
| Content | Asymmetric editorial grid, generous whitespace, card-based sections with borders | Case explorer, theory matcher, quiz, journal |
| Footer | Optional, minimal, same rules as header | Attribution (if needed) |

## Spacing & Rhythm
Generous whitespace: 2rem default gap between sections, 1rem between cards. Asymmetric grid (3-col on desktop, 1-col mobile) creates editorial rhythm. Vary density for visual hierarchy.

## Component Patterns
**Buttons**: Outlined only (white/gray border, transparent bg, invert on hover). No filled buttons ever.
**Inputs**: Underline-only (no background, 1px bottom border, animated focus). No box model.
**Cards**: 1px `border-b`, no shadow, `bg-card`, asymmetric grid placement.
**Progress**: Thin loading bar (2px height, gradient, subtle animation).

## Motion
Fade-in: `0.4s ease-out`. Hover drift: `translateY(-2px)` on cards. Flashcard flip: `0.3s ease-out` rotateY. Loading: continuous, no bounce.

## Constraints
- Zero border-radius (all `0`).
- No hover states except inversion or drift.
- No gradients in backgrounds (gradients only in loading bar).
- No shadows except `shadow-xs` on rare interactive elements.
- No rounded corners ever.

## Signature Detail
Surgical 1px borders on every card, zero radius, black/white/gray only. Hover inversion of buttons (text ↔ bg swap). Editorial grid asymmetry creates intellectual gravity.

