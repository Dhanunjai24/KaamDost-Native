# Get Shit Done (GSD) Execution Rules

When working on tasks under the GSD standard:

1. **Spec & Wave Discipline**:
   - Always divide complex requirements into ordered Waves.
   - Complete dependencies first before consumer components.
   - Do not make ad-hoc random modifications across unrelated files.

2. **Zero Context Rot**:
   - Keep `.gsd/STATE.md` updated with the active phase, completed tasks, and blockers.
   - Maintain clear boundaries and check existing patterns before refactoring.

3. **Continuous Verification**:
   - Every wave must conclude with automated verification:
     - Syntax checks on modified files (`node --check`).
     - Project build check (`.\gradlew assembleDebug` or equivalent).
     - Connected target verification when relevant (`adb devices` / `adb install`).

4. **Preserve Code Quality**:
   - Follow repository conventions (Light Glassmorphic Design System, Navy Blue primary accents, 2-color palette tokens).
