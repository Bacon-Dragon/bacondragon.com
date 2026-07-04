# Core Concepts

## The pipeline

Every stat's current value is computed as:

```
Value = (BaseValue + Σ ADD) × (1 + Σ MULTADD) × Π MULTMULT     — or ABSOLUTE override
```

clamped to the stat's resolved bounds. The Debugger shows this exact formula live for every stat.

## GameTag — identity

A tiny ScriptableObject that *is* an identity. Stats, buff types, effect types, abilities, and
categories are all identified by tags — so systems reference "Speed" or "Debuff" as assets, never as
strings. Tags carry a developer-facing description field.

## StatBase — stat definition

The definition asset for one stat:

- **Identity** — which GameTag this stat is.
- **Base mode** — how the base value is produced:
  - **Constant**: a number you set.
  - **Linear**: a weighted sum of other stats (`MaxHP = 100 + 10×Vitality`).
  - **Curve**: an AnimationCurve evaluated at another stat (`MaxHP = curve(Level)`).
  Derived stats recompute automatically when their inputs change.
- **Bounds** — Min/Max, each *None* (unbounded), a *Constant*, or *driven by another stat* (current HP
  capped at MaxHealth). Stat-driven bounds re-clamp live when the source moves.
- **Inheritance** — a single optional **Parent Stat**. Values fall through to the parent unless
  overridden per field: configure the *Tank* archetype once, derive *Speedy Tank* by overriding one
  value. Right-click any StatBase → **Make Child Stat**.

## StatSheet — stats on an entity

A component on any GameObject (player, enemy, door, rock). Lists StatBases; builds live `Stat` objects
from them on Awake, keyed by tag. Provides get/set by tag, `OnStatChanged` / `OnStatBaseChanged`
events, derived-stat recomputation, bound re-clamping, and state capture/restore.

## Buff — one modifier

A ScriptableObject that modifies one stat:

- **Affect**: ADD, MULT-ADD (additive percentages), MULT-MULT (compounding multipliers), or ABSOLUTE.
- **Lifetime**: **Instant** (one-time permanent change to the base — damage, heals), **Timed**
  (temporary modifier), or **Infinite** (until removed by code).
- **Stacking**: STACK, REPLACE_ALL, REPLACE_BY_KNOB, IGNORE, IGNORE_BY_TIME — matched by the buff's
  identity tag.
- **Categories**: tags for group removal (dispel). *Categories don't affect stacking.*
- **Resistance**: an optional resist stat on the target — 0–1, where 1 = immune and partial values
  scale duration and additive magnitude.
- **Conditions**: apply-time stat requirements on the target (e.g. Health ≤ 25).

## StatusEffect — grouped, ticking effects

A container applying several buffs together, with its own lifetime, an **Apply Interval** (re-apply
every N seconds — the DOT/HOT engine), and re-apply stacking (Refresh / Stack / Ignore). When a
Timed/Infinite effect ends, it force-removes the Timed/Infinite buffs it applied. A poison is just:
Timed 5s, interval 1s, containing an Instant −5 Health buff.

## Ability — casting

Cooldown + optional resource cost (a stat, checked and deducted from its base) + what it casts (an
effect and/or buffs), at self or any target `BuffManager`. `AbilityCaster` tracks per-ability cooldowns.

## BuffManager — the engine

The component that applies, ticks, stacks, resists, expires, cleanses, saves, and restores. One per
entity, next to its StatSheet.

## Display metadata

Every Buff / StatusEffect / Ability / StatBase carries a `DisplayInfo` (display name, description,
icon) so game UI can render buff bars, tooltips, and character sheets without extra mapping tables.
