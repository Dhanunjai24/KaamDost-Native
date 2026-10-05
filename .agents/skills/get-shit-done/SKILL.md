---
name: get-shit-done
description: >-
  Activate this skill when the user asks to "Get Shit Done", use GSD mode, or when executing complex,
  multi-step features requiring rigorous spec-driven execution, atomic task waves, and continuous verification.
---

# Get Shit Done (GSD) Workflow Engine for Antigravity

The **Get Shit Done (GSD)** methodology is a high-velocity, spec-driven development system designed to prevent context degradation and guarantee error-free deliverables through structured phases: **Discuss → Plan → Wave Execution → Verification**.

---

## The 4 GSD Operating Phases

```
   [1. DISCUSS] ────────► [2. PLAN] ────────► [3. EXECUTE (WAVES)] ────────► [4. VERIFY]
  (Clarify Needs)        (Spec & Waves)         (Atomic Changes)              (Build & Test)
```

### Phase 1: Context & Requirements (Discuss)
- Map impacted files, architecture dependencies, and constraints.
- Clarify ambiguous requirements upfront using interactive question tooling or concise proposals.
- Record key architectural decisions into `.gsd/STATE.md`.

### Phase 2: Spec-Driven Planning (Plan)
- Break the objective down into atomic, self-contained tasks.
- Group tasks into **Waves** based on strict dependency ordering:
  - **Wave 1**: Core interfaces, data schemas, tokens, foundations.
  - **Wave 2**: Business logic, component implementations, services.
  - **Wave 3**: Integration, screen assemblies, state wiring.
  - **Wave 4**: Polish, edge cases, error boundaries.
- Define explicit **Verification Criteria** for every task.

### Phase 3: Wave-based Autonomous Execution (Execute)
- Execute one wave at a time.
- Make targeted, non-breaking edits.
- Keep commits/changes atomic.
- Update `.gsd/STATE.md` with progress after each milestone.

### Phase 4: Automated Verification (Verify)
- **Syntax & Lint**: Validate all modified files pass without syntax errors.
- **Compilation**: Run local builds (e.g. `.\gradlew assembleDebug` or `npm test`).
- **Device & Runtime**: Verify target device or emulator responsiveness (e.g. `adb install`).
- Never conclude a wave without passing verification.

---

## State Tracking File: `.gsd/STATE.md`

Maintain the project state in `.gsd/STATE.md`:
```markdown
# GSD Project State

## Current Objective
[Short description of active goal]

## Active Phase
[Discuss | Plan | Execute | Verify]

## Task Waves
- [x] Wave 1: [Name] (Completed)
- [ ] Wave 2: [Name] (In Progress)
- [ ] Wave 3: [Name] (Pending)

## Latest Verification
- Build status: PASS
- Device installation: Verified on device
```
