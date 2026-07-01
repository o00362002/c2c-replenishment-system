# AGENTS.md

Thin child-mount of `o00362002/Human-AI-Collaboration-Brain`.

This repo is the C2C replenishment system execution interface. It inherits the mother Brain compact five-layer architecture, but keeps only the local files needed for execution.

Mother brain: `o00362002/Human-AI-Collaboration-Brain`
This repo's Level: `Level 3B`
Mount mode: `thin`

---

## BRAIN_ARCHITECTURE

```text
1. Brain Core / Charter
2. Interface & Integration Layer
3. Memory Layer
4. Context Routing Layer
5. Execution Edge
```

Mount principle:

```text
Mother Brain = canonical architecture and governance
Child repo = local entry, local state, local decisions, local execution contract
Level = local layer depth and required file set
Thin mount = keep this repo light; do not copy the full mother Brain
```

---

## Read first

```text
README.md
brain.manifest.yaml
CURRENT_STATE.md
CURRENT_DECISIONS.md
AGENT_DEFINITION_MAP.md
DEPENDENCY_MAP.md
```

Do not read the entire mother Brain by default. Use the task type to decide read depth.

---

## Agent route selection

Read `AGENT_DEFINITION_MAP.md` and select one `AGENT_` route before execution.

---

## Universal Execution Contract — four gates

Every task passes four gates before completion can be claimed:

```text
1. Entry Gate     — read the required entry files and identify route / level / source boundaries.
2. Plan Gate      — state what changes, which files, what is read-only, and what must not change.
3. Execution Gate — act within this repo's Level 3B scope; do not silently upgrade architecture.
4. Reality/Sync   — compare plan vs actual created/updated/deleted files and sync impact.
```

---

## Completion status

Use only these completion states:

```text
complete
partial change
No downstream sync required
```

---

## Before declaring complete

```text
1. Check whether README / CURRENT_STATE / CURRENT_DECISIONS / DEPENDENCY_MAP need sync.
2. Run: bash check_mount_integrity.sh
3. If reality does not match the claim, report partial change.
```

For full governance, use the mother repo. Keep this child repo thin.
