# Getting Started

**Fast path:** import StatFlux, open the demo scene (`StatFlux/Demo/Demo.unity`), press Play — a walking
character whose speed visibly responds to buffs, with buttons for everything below. The **Getting
Started** window (`Bacon Dragon → StatFlux → Getting Started`) opens automatically on first import and
tracks your setup progress with live checkmarks.

## Setup in four steps

### 1. Create your stats

Open `Bacon Dragon → StatFlux → Wizard` and choose **Stat**. The wizard creates the identity tag and the
StatBase together — e.g. `Speed` (base 4), `HealthMax` (base 100), and `HealthCurrent` (base 100, Max
bound = *Stat → HealthMax*).

### 2. Put them on an entity

Add a **StatSheet** component to any GameObject and list your StatBases on it. Live runtime stats are
built from that list on Awake — the same stat definitions can be reused across any number of entities.

### 3. Author buffs & effects

Wizard → **Buff** (watch the live example line while you tune values) and **Status Effect** for grouped
or ticking effects. Add a **BuffManager** component next to the StatSheet.

### 4. Apply things

```csharp
using BD;

BuffManager buffs = target.GetComponent<BuffManager>();
buffs.ApplyBuff(hasteBuff, casterGameObject);          // source tracked for cleansing
buffs.ApplyStatusEffect(poisonEffect, casterGameObject);
buffs.ClearBuffsByCategory(debuffTag);                 // dispel
buffs.ClearBuffsFromSource(casterGameObject);          // caster died

AbilityCaster caster = self.GetComponent<AbilityCaster>();
caster.TryCast(fireball, enemyBuffManager);            // cooldown + cost handled

StatSheet sheet = target.GetComponent<StatSheet>();
float hp = sheet.GetStatValue(healthTag);
sheet.OnStatChanged += (stat, source) => { /* UI, death checks... */ };
```

## Watching it work

Open `Bacon Dragon → StatFlux → Debugger`: dockable, follows your Hierarchy selection, and shows every
stat's live pipeline math — toggle **Separate Buff Values** to see each buff's individual term — plus
active buffs with time remaining and status effects.

## Save / load

```csharp
// once at startup (or use the StatFluxBootstrap component):
manifest.RegisterAll();                                 // name → asset resolution

string statsJson = JsonUtility.ToJson(sheet.CaptureState());
string buffsJson = JsonUtility.ToJson(buffs.CaptureState());

buffs.ClearAll();                                       // restore onto a clean entity
sheet.RestoreState(JsonUtility.FromJson<StatSheetState>(statsJson));
buffs.RestoreState(JsonUtility.FromJson<BuffManagerState>(buffsJson));
```

The state objects are plain serializable classes — they also work as a network spawn/sync payload.
Keep asset names unique (the manifest's **Collect** button warns about duplicates).

## UI hooks

Every Buff / StatusEffect / Ability / StatBase carries a **Display** block (name, description, icon):

```csharp
icon.sprite  = buffStatus.AppliedBuff.Display.Icon;
label.text   = buffStatus.AppliedBuff.Display.GetName(buffStatus.AppliedBuff.name);
tooltip.text = buffStatus.AppliedBuff.Display.Description;
```

## Tips

- **Resistances are stats**: give a buff a ResistStat tag; the target's 0–1 value scales it (1 = immune).
  Being stats, resistances can themselves be buffed.
- **Conditions**: buffs/effects can require stat conditions on the target at apply time (e.g. an execute
  below 25 HP).
- **Right-click a StatBase → Make Child Stat** for instant variants.
- The demo scripts (`StatFlux/Demo/Scripts/`) are a commented reference for the whole API, and the
  in-editor **API Reference** window has every command with copyable examples.
