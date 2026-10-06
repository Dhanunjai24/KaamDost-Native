# KaamDost Production Rules

## 1. Protected Environments
- Production branches (`main`) and live server environments are strictly protected.
- Never force push (`git push --force`) to `main` or `master`.

## 2. Pre-Deployment Verification Gate
No code may be deployed to production unless all following stages pass:
1. Dependencies installed cleanly (`npm ci`).
2. Lint and syntax checks pass.
3. Automated test suite passes (`verify_all.js`, E2E tests).
4. Build succeeds without warnings or bundle errors.
5. Security audit confirms zero high/critical vulnerabilities.
6. Environment variables validated against `.env.example`.
7. Database migration integrity verified.
8. Service health probe (`GET /api/health`) responds 200 OK.

## 3. Zero Downtime Deployments
- Ensure backend instances support rolling updates without dropping active long-lived SSE or WebSocket streams.
- Maintain backward-compatible API contracts during rolling releases.

## 4. Rollback Readiness
- Every production deployment must have a verified, immediate rollback procedure.
- If post-deployment smoke tests fail, trigger automated or documented rollback immediately.
