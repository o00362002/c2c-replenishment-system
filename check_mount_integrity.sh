#!/usr/bin/env bash
# check_mount_integrity.sh — portable reality-check for a thin child-mount.
# Check-only. Does not modify files.

set -u
ROOT="${1:-.}"
cd "$ROOT" || { echo "missing path: $ROOT"; exit 2; }

FAIL=0
WARN=0
fail(){ echo "FAIL  $*"; FAIL=$((FAIL+1)); }
warn(){ echo "WARN  $*"; WARN=$((WARN+1)); }
pass(){ echo "pass  $*"; }
has(){ [ -f "$1" ]; }
refs(){ [ -f "$1" ] && grep -qiE "$2" "$1" 2>/dev/null; }

echo "Child Mount Reality-Check"

LEVEL="Level 1"
if has brain.manifest.yaml; then
  L=$(grep -Ei '^[[:space:]]*level:' brain.manifest.yaml | head -1 | sed -E 's/#.*$//; s/.*level:[[:space:]]*//I; s/[[:space:]]+$//' | tr -d '"')
  [ -n "$L" ] && LEVEL="$L"
fi
case "$LEVEL" in
  *'<LEVEL>'*) warn "level not set in brain.manifest.yaml"; LEVEL="Level 1" ;;
esac
echo "Detected level: $LEVEL"

HITS=0
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  LIST=$(git -c core.quotePath=false ls-files)
else
  LIST=$(find . -type f -not -path '*/.git/*')
fi
while IFS= read -r f; do
  [ -f "$f" ] || continue
  if grep -qE '^<<<<<<< .' "$f" 2>/dev/null && grep -qE '^>>>>>>> .' "$f" 2>/dev/null; then
    fail "$f has unresolved conflict markers"
    HITS=$((HITS+1))
  fi
done <<EOF
$LIST
EOF
[ "$HITS" -eq 0 ] && pass "no unresolved conflict markers"

has README.md && pass "README.md exists" || fail "README.md missing"
if has AGENTS.md; then
  pass "AGENTS.md exists"
  refs AGENTS.md 'Execution Contract|gate|Entry Gate|partial change' && pass "AGENTS.md carries execution contract" || fail "AGENTS.md missing execution contract"
else
  warn "AGENTS.md missing"
fi

case "$LEVEL" in
  *2*|*3A*|*3B*|*3a*|*3b*)
    has CURRENT_STATE.md && pass "CURRENT_STATE.md exists" || warn "CURRENT_STATE.md recommended"
    { has CURRENT_DECISIONS.md || has DECISIONS.md; } && pass "decisions file exists" || warn "CURRENT_DECISIONS.md recommended"
    has DEPENDENCY_MAP.md && pass "DEPENDENCY_MAP.md exists" || warn "DEPENDENCY_MAP.md recommended"
    if has AGENT_DEFINITION_MAP.md; then
      pass "AGENT_DEFINITION_MAP.md exists"
      refs AGENT_DEFINITION_MAP.md 'AGENT_' && pass "AGENT_DEFINITION_MAP contains AGENT_ routing" || fail "AGENT_DEFINITION_MAP missing AGENT_ routes"
    else
      fail "AGENT_DEFINITION_MAP.md missing"
    fi
    ;;
  *Module*)
    has CURRENT_STATE.md && pass "CURRENT_STATE.md exists" || warn "CURRENT_STATE.md recommended"
    { has CURRENT_DECISIONS.md || has DECISIONS.md; } && pass "decisions file exists" || warn "CURRENT_DECISIONS.md recommended"
    has DEPENDENCY_MAP.md && pass "DEPENDENCY_MAP.md exists" || warn "DEPENDENCY_MAP.md recommended"
    ;;
esac

if has DEPENDENCY_MAP.md; then
  refs DEPENDENCY_MAP.md 'completion gate|gate|dependency chain|output mode|route.*workflow.*template' && pass "DEPENDENCY_MAP carries dependency/gate language" || warn "DEPENDENCY_MAP has no visible dependency-linked gate language"
fi

for f in docs/rag_policy.md docs/knowledge_graph.md docs/mcp_gateway.md docs/interface_gateway_layer.md; do
  if has "$f"; then
    warn "$f exists; verify it has real content and is not an empty future placeholder"
  fi
done

echo "Result: FAIL=$FAIL WARN=$WARN"
if [ "$FAIL" -gt 0 ]; then echo "partial change required"; exit 1; fi
echo "complete"
exit 0
