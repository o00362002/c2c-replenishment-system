# c2c-replenishment-system DEPENDENCY_MAP

最後更新：2026-07-01

This file is the local dependency chain and completion-gate source for the C2C replenishment system child mount.

---

## Canonical dependency chain

```text
output mode
→ agent route
→ workflow
→ input data
→ calculation / rule layer
→ template / output format
→ completion gate
→ reality check
```

Completion gates belong with this dependency map. Do not create a second active gate source elsewhere.

---

## Output modes

```text
replenishment recommendation
backtest result
purchase suggestion
diagnostic report
maintenance / documentation update
```

---

## Route dependencies

| Output mode | Route | Workflow | Completion gate |
|---|---|---|---|
| replenishment recommendation | AGENT_REPLENISHMENT_OUTPUT | load inputs → apply rules → produce output | input scope and output format verified |
| backtest result | AGENT_REPLENISHMENT_BACKTEST | load historical data → compare rule result → summarize impact | evidence and comparison basis stated |
| purchase suggestion | AGENT_REPLENISHMENT_OUTPUT | derive demand → check warehouse / store logic → export | assumptions and constraints stated |
| diagnostic report | AGENT_REPLENISHMENT_OUTPUT | inspect result → classify issue → summarize action | store / SKU / style scope verified |
| maintenance update | AGENT_REPLENISHMENT_MAINTENANCE | update docs / mount files → sync index → run check | reality check complete or partial change reported |

---

## Local gates

Before claiming complete:

```text
1. Confirm selected AGENT_ route.
2. Confirm affected files.
3. Confirm whether README / CURRENT_STATE / CURRENT_DECISIONS / DEPENDENCY_MAP need sync.
4. Run or request: bash check_mount_integrity.sh
5. If any required file or check is missing, report partial change.
```

---

## Mother Brain sync boundary

Sync to the mother repo only when the change affects:

```text
architecture
mount level
source-of-truth boundary
reusable governance rule
cross-repo dependency
memory update policy
```

Do not sync ordinary replenishment execution details into mother Brain core.
