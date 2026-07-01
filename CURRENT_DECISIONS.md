# c2c-replenishment-system CURRENT_DECISIONS

最後更新：2026-07-01

This file records accepted local decisions for the C2C replenishment system child repo.

---

## 2026-07-01：Mount as Level 3B thin child repo

Decision:

```text
This repo is mounted to o00362002/Human-AI-Collaboration-Brain as a Level 3B thin child repo.
```

Reason:

```text
The replenishment system is a repeatable product/runtime-style execution system.
It needs local state, local decisions, route selection, dependency gates, and reality checks.
```

Rules:

```text
Mother Brain owns architecture and governance.
This repo owns replenishment-system execution details.
Do not copy the full mother Brain into this repo.
Do not redefine Brain top-level layers locally.
Use Memory Patch / review before promoting local rules to mother Brain core.
```

Canonical local entry files:

```text
README.md
AGENTS.md
brain.manifest.yaml
CURRENT_STATE.md
CURRENT_DECISIONS.md
AGENT_DEFINITION_MAP.md
DEPENDENCY_MAP.md
check_mount_integrity.sh
```
