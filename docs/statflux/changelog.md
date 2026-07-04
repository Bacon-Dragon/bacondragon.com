# StatFlux — Changelog

## 1.0.0

Initial release.

- **Stats**: GameTag identity; StatBase definitions with Constant / Linear / Curve base derivation,
  reactive derived stats, stat-driven min/max bounds with live re-clamping, and single-parent
  inheritance with per-field overrides (archetypes → variants).
- **Buffs**: ADD / MULT-ADD / MULT-MULT / ABSOLUTE pipeline, Instant / Timed / Infinite lifetimes,
  five stacking modes, categories (dispel/queries), source tracking & cleansing, resistances
  (resist-by-stat with immunity and partial potency), apply-time stat conditions.
- **Status Effects**: multi-buff containers with duration, interval ticking (DOT/HOT), re-apply
  stacking modes, and automatic teardown of applied buffs.
- **Abilities**: cooldown + optional resource cost, casting effects/buffs at self or a target.
- **Save / Load**: JSON-friendly state capture/restore for stats, buffs, and effects (also usable as
  a network sync payload), with a name-resolution manifest.
- **Tooling**: creation Wizard (guided 3-step authoring with live worked examples), dockable runtime
  Debugger (live pipeline math per stat, per-buff terms), Getting Started onboarding window,
  conditional custom inspectors, right-click Make Child Stat, one-click demo scene builder.
- **Display metadata**: name / description / icon on every asset type for game UI.
