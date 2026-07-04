# StatFlux

**Stats, buffs, status effects & abilities for Unity — data-driven, dependency-free, fully inspectable.**

StatFlux gives your game a complete character-stat pipeline: define stats as assets, modify them with
buffs and ticking status effects, cast abilities with cooldowns and costs, and watch every number
compute live in the editor. No third-party dependencies. No code required for authoring.

> **Unity Asset Store:** *coming soon* · Requires Unity 6+

## Why StatFlux

- **Buffs done right.** The full lifecycle: `(base + ΣADD) × (1 + ΣMULTADD) × ΠMULTMULT` with ABSOLUTE
  overrides, Instant / Timed / Infinite lifetimes, five stacking modes, categories for dispel, source
  tracking, resistances (immunity + partial potency), and apply-time conditions.
- **Stats that react.** Derived stats (`MaxHealth = f(Vitality)`) recompute automatically; bounds can be
  driven by other stats (current HP capped at MaxHealth) and re-clamp live.
- **Archetypes → variants.** StatBase inheritance with per-field overrides: configure *Tank* once,
  derive *Speedy Tank* by overriding one value.
- **See the math.** The dockable Debugger shows every stat's exact calculation — per-buff terms,
  clamping, countdowns — live in Play mode.
- **Author in seconds.** A guided Wizard creates stats, buffs, effects, abilities, and categories with
  inline dependency creation and live worked examples.
- **No lock-in.** Works with any character controller via plain components and a small tag-based API.
  Save/load ships in the box and doubles as a network sync payload.

## What's in the package

| | |
|---|---|
| **Runtime** | `StatSheet`, `Buff`/`BuffManager`, `StatusEffect`, `Ability`/`AbilityCaster`, save/load registry |
| **Editor tooling** | Creation Wizard · live Debugger · Getting Started onboarding · API Reference window · conditional inspectors with worked examples |
| **Demo** | A playable scene: a walking character whose speed visibly responds to buffs, slows, roots, and poison |
| **Docs** | This site, plus the quick-start shipped in the package |

## Quick taste

```csharp
using BD;

buffs.ApplyBuff(hasteBuff, caster);                 // ×2 speed for 4s, stacking rules applied
buffs.ApplyStatusEffect(poisonEffect, caster);      // 5 dmg/sec DOT with automatic teardown
buffs.ClearBuffsByCategory(debuffTag);              // dispel
casterComponent.TryCast(fireball, enemyBuffs);      // cooldown + mana cost handled

sheet.OnStatChanged += (stat, source) => UpdateUI(stat);
```

Continue with **[Getting Started →](/statflux/getting-started)**
