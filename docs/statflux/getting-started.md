# Getting Started

**The fastest way to understand StatFlux is to play with it.** Import the package, open the demo
scene (`StatFlux/Demo/Demo.unity`), and press Play. A character walks in circles; the buttons apply
haste, slow, root, and poison, and you'll see its speed change in the world, on the buff bar, and in
the live stat readout — all at once.

When you're ready to set up your own project, the **Getting Started** window
(`Bacon Dragon → StatFlux → Getting Started`, opens automatically on first import) walks you through
the steps below and checks them off as you go.

## Step 1 — Create your stats

Open `Bacon Dragon → StatFlux → Wizard` and choose **Stat**. Give it a name like `Speed` and a base
value. That's it — the wizard creates both the stat definition and its identity tag in one pass.

A typical starter set:
- `Speed` — base 4
- `HealthMax` — base 100
- `HealthCurrent` — base 100, with its **Max bound set to the HealthMax stat**, so current health can
  never exceed max health (and follows it if max changes)

## Step 2 — Put stats on an entity

Add a **StatSheet** component to any GameObject and add your StatBases to its list. On Play, the
sheet builds live stats from that list. The same stat assets work on any number of entities — define
`Speed` once, use it on every unit in the game.

## Step 3 — Make some buffs

Back in the Wizard, choose **Buff**. Pick which stat it modifies, how (flat add, percentage,
multiplier, or absolute), and for how long. As you type, the wizard shows a **worked example** —
`(100 + 10) × (1 + 0) × 1 = 110` — so you can sanity-check the math before you ever press Play.

For grouped or over-time effects (a poison that ticks, a frost that slows two stats at once), create
a **Status Effect** and add buffs to it.

Finally, add a **BuffManager** component next to the StatSheet — it's the engine that applies,
ticks, stacks, and removes everything.

## Step 4 — Apply things

From UI buttons, ability code, collision handlers — anywhere:

```csharp
using BD;

BuffManager buffs = target.GetComponent<BuffManager>();

buffs.ApplyBuff(hasteBuff, caster);                // a single buff
buffs.ApplyStatusEffect(poisonEffect, caster);     // a bundle (ticks on its own)
buffs.ClearBuffsByCategory(debuffTag);             // "cleanse all debuffs"
buffs.ClearBuffsFromSource(caster);                // "the caster died"
```

The second argument is *who applied it* — that's what makes remove-by-source possible later.

Abilities wrap the whole cast flow (cooldown + cost + apply) in one call:

```csharp
AbilityCaster caster = self.GetComponent<AbilityCaster>();
caster.TryCast(fireball, enemyBuffs);   // false if on cooldown or unaffordable
```

And reading stats is one line, with an event for reacting to changes:

```csharp
StatSheet sheet = target.GetComponent<StatSheet>();
float hp = sheet.GetStatValue(healthTag);
sheet.OnStatChanged += (stat, source) => { if (stat.Value <= 0f) Die(); };
```

## Step 5 — Show it on screen

Add a **BuffBarUI** component to your player (or let the demo's controller spawn it) — it creates its
own canvas and shows every active buff and effect as an icon with countdowns, radial timers, stack
counts, and expiring flashes. Each asset configures its own appearance in its **Indicator** section;
its icon, name, and description live in its **Display** section — the same fields your own UI can
read:

```csharp
icon.sprite = buffStatus.AppliedBuff.Display.Icon;
label.text  = buffStatus.AppliedBuff.Display.GetName(buffStatus.AppliedBuff.name);
```

## When something looks wrong

Open `Bacon Dragon → StatFlux → Debugger`, click the entity, and read the math. Every stat shows its
full live calculation — base, every buff's contribution, clamping — exactly as it's computed. The
**Library** window (`… → Library`) is the other half: every buff and effect in the project, where
it's used, and what's currently active on whom.

## Saving and loading

Two calls capture everything — stat values, active buffs, effects, and their remaining time — as
plain serializable objects; two calls restore it:

```csharp
// once at startup (or use the StatFluxBootstrap component):
manifest.RegisterAll();                            // lets saves find assets by name

string stats = JsonUtility.ToJson(sheet.CaptureState());
string buffsJson = JsonUtility.ToJson(buffs.CaptureState());
// ...write to your save file...

buffs.ClearAll();                                  // restore onto a clean entity
sheet.RestoreState(JsonUtility.FromJson<StatSheetState>(stats));
buffs.RestoreState(JsonUtility.FromJson<BuffManagerState>(buffsJson));
```

A poison that had 2.3 seconds left when you saved has 2.3 seconds left when you load. The same
payloads work for network sync.

## Where to go next

- **[Core Concepts](/statflux/concepts)** — how the math and the building blocks fit together
  (with worked examples).
- **[API Reference](/statflux/api)** — every command, with copyable snippets. Also available
  in-editor: `Bacon Dragon → StatFlux → API Reference`.
- The demo scripts (`StatFlux/Demo/Scripts/`) are a fully commented reference for the whole API.
