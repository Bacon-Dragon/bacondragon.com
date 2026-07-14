# Core Concepts

This page explains how StatFlux thinks, in plain language. Five minutes here and the whole system
will feel obvious.

## How a stat's value is calculated

Every stat has a **base value** (what it is naturally) and a **current value** (what it is right now,
after buffs). The current value is always computed the same way:

```
current = (base + all ADD buffs) × (1 + all MULTADD buffs) × (all MULTMULT buffs multiplied together)
```

Or in words: **flat bonuses first, then percentage bonuses, then multipliers.**

**Worked example.** Your character's base Speed is 100. Three buffs are active:

| Buff | Type | Value | Meaning |
|---|---|---|---|
| Swift Boots | ADD | +10 | flat +10 speed |
| Wind Blessing | MULTADD | +0.2 | +20% |
| Haste Spell | MULTMULT | ×2 | doubled |

```
(100 + 10) × (1 + 0.2) × 2  =  110 × 1.2 × 2  =  264
```

Remove the Haste Spell and it recomputes instantly: `110 × 1.2 = 132`. You never do this math
yourself — but the Wizard, the inspectors, and the Debugger all show it to you live.

**Why two kinds of multipliers?** They stack differently, and that's a design lever:

- **MULTADD** bonuses *add together* before multiplying: two +20% buffs give +40% (`× 1.4`). Use this
  when you want percentage bonuses to feel fair and linear.
- **MULTMULT** bonuses *compound*: two ×1.2 buffs give ×1.44. Use this for rare, dramatic effects —
  or ×0 for a hard stop (that's how the demo's Root works: Speed × 0 = frozen).

There's also **ABSOLUTE**, which ignores everything and pins the value outright ("polymorph: your
attack is 1"). Use it sparingly.

## The building blocks

### GameTag — a name that's an asset

Instead of identifying stats by fragile strings ("Speed", "speed", "SPD"?), everything in StatFlux is
identified by a **GameTag** asset. Your code and your data both point at the same asset, so typos are
impossible and renames are safe.

### StatBase — the definition of a stat

A StatBase asset answers three questions about a stat:

1. **What is it?** — which GameTag identifies it.
2. **What's its base value?** — either a plain number, or *computed from other stats*:
   - **Linear**: a weighted sum. `MaxHealth = 100 + 10 × Vitality` — every point of Vitality is worth
     10 max health.
   - **Curve**: read the value off a curve you draw. `MaxHealth = curve(Level)` — perfect for
     level-up tables that aren't a straight line.
   Computed stats update *automatically* the moment their inputs change.
3. **What are its limits?** — optional Min and Max bounds. A bound can be a number, or **another
   stat**: set current Health's max bound to the MaxHealth stat, and when MaxHealth drops, current
   Health is pulled down with it — instantly, no code.

**Inheritance for variants.** A StatBase can have a parent. The child inherits every value and
overrides only what you check. Build *Tank* once; make *Speedy Tank* by overriding just its speed.
Right-click any StatBase → **Make Child Stat**.

### StatSheet — stats on a thing

A component you put on anything — player, enemy, door, treasure chest. You list which StatBases it
has; at runtime it builds live stats from them. Read and write by tag:

```csharp
float hp = sheet.GetStatValue(healthTag);
sheet.SetStatBaseValue(healthTag, hp - 10f, attacker);   // take damage
sheet.OnStatChanged += (stat, source) => UpdateHealthBar(stat);
```

### Buff — one change to one stat

A Buff asset modifies a single stat using one of the four types above, for one of three **lifetimes**:

- **Instant** — happens once and is done. Damage, healing, a permanent level-up bonus.
- **Timed** — lives for N seconds as a modifier, then removes itself and the stat springs back.
- **Infinite** — stays until your code removes it. Equipment bonuses, toggled auras.

Each buff also picks a **stacking rule** for when a second copy arrives: stack alongside, replace,
or be ignored (with a smarter variant that only ignores *weaker* incoming buffs).

### StatusEffect — a bundle of buffs with a clock

Real game effects are rarely one number. *Frost* slows movement AND attack speed. *Poison* deals
damage every second for five seconds. A StatusEffect wraps a list of buffs and applies them together,
with two superpowers:

- **Apply Interval** — re-apply the buffs every N seconds. Poison is literally: a Timed 5s effect,
  interval 1s, containing an Instant −5 Health buff. Five ticks, done.
- **Automatic cleanup** — when the effect ends (or is dispelled), every buff it applied is removed.
  Nothing leaks.

### Ability — a button players press

Cooldown + optional cost + what it casts. `TryCast` checks the cooldown, checks and spends the cost
stat (mana, stamina...), applies the effect/buffs to a target, and starts the cooldown. One call.

### Categories, resistances, conditions

- **Categories** are tags on buffs/effects used for group removal — "cleanse all *Debuffs*", "dispel
  all *Magic*". (Stacking is decided by the buff's own identity tag, not its categories.)
- **Resistance**: a buff can name a resist stat. If the target has `PoisonResist = 0.25`, incoming
  poison is 25% weaker and shorter; at `1.0` they're immune. Since resists are stats, they can be
  buffed like anything else.
- **Conditions**: a buff or effect can require things about the target — "only applies if Health is
  below 25" — checked at apply time.

## The buff bar

Ship-ready UI in one component: add **BuffBarUI**, point it at a BuffManager, done — it builds its
own canvas. Each buff/effect asset chooses how it appears via its **Indicator** settings:

- countdown number (hidden for infinite effects),
- a grey **radial sweep** filling as time runs out,
- an **expiring flash** that pulses faster as the end approaches,
- stack counts (`x3`) — or one icon per instance if you prefer,
- or hidden from the bar entirely (internal mechanics).

## Watching it all work

Open `Bacon Dragon → StatFlux → Debugger` and select any entity. Every stat shows its live
calculation — the exact formula from the top of this page, with real numbers, updating as buffs come
and go. Toggle *Separate Buff Values* to see each buff's individual contribution. If a number ever
surprises you, the answer is one click away.
