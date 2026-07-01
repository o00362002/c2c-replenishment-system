# c2c-replenishment-system AGENT_DEFINITION_MAP

最後更新：2026-07-01

This file defines local agent routes for the Level 3B replenishment-system child mount.

---

## Route selection rule

Before execution, choose one route:

```text
AGENT_REPLENISHMENT_LOGIC
AGENT_REPLENISHMENT_BACKTEST
AGENT_REPLENISHMENT_OUTPUT
AGENT_REPLENISHMENT_MAINTENANCE
```

---

## AGENT_REPLENISHMENT_LOGIC

Use when changing or reviewing replenishment rules.

Reads:

```text
README.md
CURRENT_STATE.md
CURRENT_DECISIONS.md
DEPENDENCY_MAP.md
```

May update:

```text
local replenishment logic files
local rule documentation
CURRENT_DECISIONS.md, if a durable local decision is accepted
```

Must not:

```text
redefine mother Brain architecture
promote local C2C-specific rules into mother core without review
```

---

## AGENT_REPLENISHMENT_BACKTEST

Use when testing historical replenishment results or comparing rule changes.

Reads:

```text
README.md
CURRENT_STATE.md
DEPENDENCY_MAP.md
historical data / reports, if present
```

Outputs:

```text
backtest result
rule impact summary
partial change status if evidence is incomplete
```

---

## AGENT_REPLENISHMENT_OUTPUT

Use when producing replenishment outputs, purchase suggestions, diagnostic summaries, or exports.

Reads:

```text
README.md
CURRENT_STATE.md
DEPENDENCY_MAP.md
local data and templates, if present
```

Must verify:

```text
input date range
store scope
SKU / style scope
output format
```

---

## AGENT_REPLENISHMENT_MAINTENANCE

Use when changing repo structure, mount files, documentation, or execution gates.

Reads:

```text
AGENTS.md
brain.manifest.yaml
CURRENT_STATE.md
CURRENT_DECISIONS.md
DEPENDENCY_MAP.md
check_mount_integrity.sh
```

Must run or request:

```text
bash check_mount_integrity.sh
```
