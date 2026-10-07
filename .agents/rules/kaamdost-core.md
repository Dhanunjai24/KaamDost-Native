# KaamDost Core Engineering Rules

## 1. Inspect Before Changing
- Never modify an existing file without first reading and understanding its current implementation, dependencies, and upstream callers.
- Cross-reference frontend components with backend API routes before attempting any integration changes.

## 2. Minimal Safe Changes
- Limit modifications strictly to the minimum scope required to fulfill the task or bugfix.
- Prefer surgical edits over full file replacements.

## 3. No Unnecessary Rewrites
- Working features are the foundation of KaamDost.
- Never refactor or rewrite functional code merely for stylistic modernization or personal preference.

## 4. Preserve Working Functionality
- Existing customer booking flows, partner duty toggles, and payment gateways must remain functional throughout any development cycle.
- Do not remove or deprecate endpoints or parameters that active mobile apps rely upon.

## 5. No Invented APIs
- Never fabricate or guess API routes, query params, or payload structures.
- All endpoints must match actual declarations in `backend/src/server.js` or associated route files.

## 6. No Invented Database Fields
- Do not query or insert database columns or document fields that do not exist in the official schema.
- Schema modifications must follow formal migration procedures.

## 7. No Secrets in Code
- API keys, JWT secrets, database credentials, and service tokens must NEVER be hardcoded.
- Always load configuration via environment variables through `config.js` or `process.env`.

## 8. Test Every Change
- No bug fix or feature is considered complete until verified with empirical evidence (logs, automated tests, or screen captures).
- Never claim "fixed" without running tests.

## 9. Maintain Backwards Compatibility
- Older mobile client builds may remain installed on user devices.
- Backend APIs must accept existing payloads and preserve response signatures.

## 10. Protect Production
- Production environments, live databases, and production branches are sacred.
- All destructive operations require explicit human confirmation.
