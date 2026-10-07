# Feature Development Workflow — KaamDost

This workflow governs how feature requests, architectural improvements, and bug fixes move from concept to production.

```
USER REQUEST
     ↓
[CO-FOUNDER]          Analyze requirements, product economics & architectural risk
     ↓
[PROJECT MANAGER]     Decompose into tasks, set dependency order & acceptance criteria
     ↓
[SPECIALIST AGENTS]   Implement changes (UI/UX, Frontend, Backend, Database)
     ↓
[TESTING]             Execute automated tests (Unit, API, E2E, Regression)
     ↓
[SECURITY]            Audit auth, secrets, injection vectors & RBAC
     ↓
[CODE REVIEW]         Verify code cleanliness, backwards compatibility & absence of regressions
     ↓
[DEVOPS]              Validate build, containerization & deployment readiness
     ↓
   DONE               Empirically verified and ready for production
```

---

## Agent Selection Matrix (Do NOT invoke all 10 agents for every task!)

Only invoke agents relevant to the specific problem domain:

| Task Type | Sequence of Agents |
|---|---|
| **UI / Styling Bug** | UI/UX → Frontend → Testing → Code Reviewer |
| **API Endpoint / Logic Bug** | Backend → (Database if schema touches) → Testing → Security → Code Reviewer |
| **Database Schema Change** | Database → Backend → Testing → Security → Code Reviewer |
| **Deployment / CI/CD Issue** | DevOps → (Backend/Frontend if build touches) → Testing → Security |
| **Security / Auth Vulnerability** | Security → Backend → (Database if credentials touch) → Testing → Code Reviewer |
| **New Full-Stack Feature** | Co-Founder → PM → UI/UX → Frontend + Backend + Database → Testing → Security → Code Reviewer → DevOps |

---

## Detailed Stage Protocols

### Stage 1: Co-Founder Assessment
1. Inspect the existing implementation.
2. Determine business feasibility and alignment with blue-collar marketplace goals.
3. Validate that no working code or existing API contract is broken unnecessarily.

### Stage 2: Project Management
1. Break down the scope into discrete, bounded tasks.
2. Maintain task states: `TODO` -> `IN PROGRESS` -> `BLOCKED` -> `READY FOR TEST` -> `TESTING` -> `FAILED` -> `DONE`.
3. Never advance a task to `DONE` without automated test proof.

### Stage 3: Specialist Implementation
1. **Frontend / Mobile**: Follow `frontend.md` rules and reuse Glass design tokens.
2. **Backend**: Maintain booking state machine (`OFFERED` -> `ACCEPTED` -> `STARTED` -> `COMPLETED` -> `PAID`).
3. **Database**: Use migrations with rollback strategy; protect production data.

### Stage 4: Testing & Empirical Validation
1. Execute unit and integration tests.
2. Execute Playwright E2E tests for web flows or node E2E tests for API flows.
3. Record test logs and failure screenshots where applicable.

### Stage 5: Security Review
1. Ensure no hardcoded secrets or PII in logs.
2. Verify rate-limiting and authorization guards.

### Stage 6: Code Review
1. Inspect git diff for dead code, regression risks, and architectural drift.
2. Approve only if backwards compatibility is guaranteed.

### Stage 7: DevOps & Deployment Gate
1. Build verification (`npm run build`).
2. Verify `/api/health` probe responds 200 OK.
