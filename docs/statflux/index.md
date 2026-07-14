# StatFlux

**Every game has stats. StatFlux handles everything that changes them.**

Health, speed, armor, mana — defining them is easy. The hard part is everything that *touches* them:
the haste potion that stacks with the speed rune but not with itself, the poison that ticks every
second, the shield that expires mid-fight, the boss aura that halves healing, the save file that has
to bring it all back exactly as it was. That web of interactions is where stat systems break — and
it's exactly what StatFlux manages for you.

> **Unity Asset Store:** *coming soon* · Unity 6+ · no third-party dependencies

## Author it without code

Designers build everything as assets — no programming required:

- A guided **Wizard** walks you through creating stats, buffs, effects, and abilities, and shows a
  **live worked example** of the math as you type. Change a value, watch the result update.
- Inspectors show only the fields that matter and include the same live examples.
- A **Library** window lists every buff and effect in your project, filters them, flags unused ones,
  and shows exactly where each is used.
- A **Debugger** shows every stat's full calculation ticking live in Play mode — no more "why is my
  speed 37?"

When you do want code, the whole system is a small, clean API — apply a buff in one line.

## It handles the hard cases

- **Stacking, done properly.** Five stacking modes per buff. Haste stacks with itself; armor potions
  replace each other; the weaker slow gets ignored while a stronger one runs.
- **Timers of every kind.** Instant hits, timed buffs, permanent effects, damage-over-time ticks —
  and when a status effect ends, everything it applied is cleaned up automatically.
- **Stats that depend on stats.** Max health computed from vitality. Current health capped at max
  health — and when max health changes, current follows instantly.
- **Resistances and conditions.** Poison resist as a stat (buff the resist itself!), immunity at 100%,
  effects that only land below an HP threshold.
- **Cleansing.** Remove by type, by category ("dispel all debuffs"), or by source ("the caster died").
- **Save and load.** One call captures every stat, buff, and mid-flight timer to plain JSON; one call
  restores it. The same payload works for network sync.
- **On-screen buff bar included.** A drop-in component shows active effects with icons, countdown
  numbers, radial timers, stack counts, and an expiring flash — all configured per asset, zero setup.

## Try it in 60 seconds

Import, open the demo scene, press Play. A character walks in circles; buttons apply haste, slow,
root, and poison, and you watch its speed change in real time — in the world, on the buff bar, and in
the Debugger's live math view.

## What's in the package

| | |
|---|---|
| **Runtime** | Stat sheets, buffs, status effects, abilities, resistances, save/load, buff bar UI |
| **Editor tooling** | Creation Wizard · asset Library with usage tracking · live Debugger · Getting Started onboarding · in-editor API reference |
| **Demo** | A playable scene showing every feature |
| **Docs** | This site, plus a quick-start in the package |

Continue with **[Getting Started →](/statflux/getting-started)**
