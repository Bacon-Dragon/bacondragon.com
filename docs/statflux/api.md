# API Reference

All types live in the `BD` namespace. This same reference is available in-editor:
`Bacon Dragon → StatFlux → API Reference` (searchable, with copyable examples).

## StatSheet — stats on an entity

| Member | Description |
|---|---|
| `float GetStatValue(GameTag stat)` | Current (buff-modified) value. 0 if the stat doesn't exist. |
| `float GetStatBaseValue(GameTag stat)` | Base (unmodified) value. |
| `void SetStatBaseValue(GameTag, float, GameObject source)` | Permanent base change (damage/heal/level-up). Buff pipeline re-runs; bounds clamp. |
| `void SetStatValue(GameTag, float, GameObject source)` | Sets the current value directly (the BuffManager owns this for buffed stats). |
| `Stat GetStat(GameTag)` / `bool HasStat(GameTag)` | Live Stat access / existence check. |
| `event Action<Stat, GameObject> OnStatChanged` | Any stat's current value changed. |
| `event Action<Stat, GameObject> OnStatBaseChanged` | Any stat's base changed. |
| `StatSheetState CaptureState()` / `RestoreState(state)` | Save/load snapshot of all stat values. |

```csharp
sheet.OnStatChanged += (stat, source) =>
{
    if (stat.StatTag == healthTag && stat.Value <= 0f) Die();
};
```

## BuffManager — buffs & status effects

| Member | Description |
|---|---|
| `BuffStatus ApplyBuff(Buff)` / `ApplyBuff(Buff, GameObject source)` | Apply a buff (conditions + resistance checked, stacking rules run). Instant buffs hit the base once and return null. |
| `StatusEffectStatus ApplyStatusEffect(StatusEffect)` / `(fx, source)` | Apply an effect: buffs now, ticks per interval, teardown at end. |
| `void ClearBuff(BuffStatus)` | Remove one buff; its stat recalculates. |
| `void ClearAllBuffsByTag(GameTag)` | Remove every buff with that identity tag. |
| `void ClearBuffsByCategory(GameTag)` / `ClearStatusEffectsByCategory(GameTag)` | Dispel by category. |
| `void ClearBuffsFromSource(GameObject)` / `ClearStatusEffectsFromSource(GameObject)` | Remove everything a source applied. |
| `void RemoveStatusEffect(StatusEffectStatus)` | Force-end one effect (removes its buffs). |
| `void ClearAll()` | Remove everything (before RestoreState; death/respawn). |
| `IReadOnlyList<StatusEffectStatus> ActiveEffects` | Read-only active effects, for UI. |
| `BuffManagerState CaptureState()` / `RestoreState(state)` | Save/load snapshot (remaining times + potency). |

```csharp
buffs.ApplyStatusEffect(poisonEffect, caster.gameObject);
buffs.ClearBuffsByCategory(debuffTag);   // cleanse
```

## AbilityCaster — casting

| Member | Description |
|---|---|
| `bool TryCast(Ability)` / `TryCast(Ability, BuffManager target)` | Cast if ready + affordable: deduct cost, apply effect/buffs, start cooldown. |
| `bool IsReady(Ability)` / `float CooldownRemaining(Ability)` | Cooldown queries for ability-bar UI. |
| `bool CanAfford(Ability)` | Cost stat (base value) covers the cost, or the ability is free. |

```csharp
cooldownOverlay.fillAmount = caster.CooldownRemaining(fireball) / fireball.Cooldown;
```

## Stat — one live stat

| Member | Description |
|---|---|
| `Value` / `BaseValue` / `ValueMin` / `ValueMax` | Current, base, and resolved bounds (±Infinity = unbounded). |
| `event OnValueChanged` / `OnBaseChanged` | Per-stat hooks (the sheet aggregates them). |

## StatBase — stat definition assets

| Member | Description |
|---|---|
| `GameTag ResolveStatTag()` / `float ResolveBaseValue()` | Resolved through the parent chain. |
| `bool IsDerived` / `float EvaluateBase(IStatValueProvider)` | Derived-base computation (automatic at runtime). |
| `StatBound ResolveMin()` / `ResolveMax()` | Effective bounds (overrides win, root authoritative). |
| `DisplayInfo ResolveDisplay()` | UI metadata, inherited through the chain. |

## Save / Load

| Member | Description |
|---|---|
| `StatFluxManifest.RegisterAll()` | Register tags/buffs/effects by name (once at startup — or use the `StatFluxBootstrap` component). |
| `StatFluxRegistry.Register / ResolveTag / ResolveBuff / ResolveEffect / Clear` | The name→asset map behind save/load. |
| `StatSheetState` / `BuffManagerState` / `StatSnapshot` / `BuffSnapshot` / `StatusEffectSnapshot` | Plain serializable state types (JSON-friendly; usable as network payloads). |

```csharp
manifest.RegisterAll();
string json = JsonUtility.ToJson(buffs.CaptureState());
buffs.ClearAll();
buffs.RestoreState(JsonUtility.FromJson<BuffManagerState>(json));
```

## DisplayInfo — UI metadata

| Member | Description |
|---|---|
| `DisplayName` / `Description` / `Icon` | UI-facing metadata on Buff, StatusEffect, Ability, StatBase. |
| `GetName(string fallback)` | DisplayName, or the fallback (typically the asset name) when empty. |

```csharp
icon.sprite = buffStatus.AppliedBuff.Display.Icon;
label.text  = buffStatus.AppliedBuff.Display.GetName(buffStatus.AppliedBuff.name);
```
