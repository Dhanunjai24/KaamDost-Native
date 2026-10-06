---
name: node-backend
description: Standards for REST APIs, real-time dispatching, and business logic in KaamDost.
---

# Node.js & Express Backend Development Skill

## Purpose
Ensure that KaamDost's central backend service remains robust, performant, secure, and backwards-compatible with all active clients.

## When to Use
- Creating or updating REST endpoints in `/backend/src`.
- Implementing business logic for worker matching, pricing, or payouts.
- Handling 3rd-party integrations (SMS OTP, Razorpay, OpenRouter AI).
- Enhancing middleware for validation, rate limiting, or logging.

## Technical Standards
- Enforce standard Express middleware chaining with explicit error handling (`next(err)`).
- Validate all incoming payloads using `express-validator` prior to controller execution.
- Maintain the authoritative booking lifecycle states:
  `OFFERED` -> `ACCEPTED` -> `STARTED` -> `COMPLETED` -> `PAID`
- Return standardized JSON response envelopes:
  `{ "success": true, "data": ... }` or `{ "success": false, "error": "Reason" }`
- Support health monitoring via `GET /api/health`.

## Common Mistakes
- Unhandled Promise rejections that crash the Node.js process.
- Modifying existing endpoint payload signatures, breaking legacy mobile apps.
- Missing rate limits on authentication and OTP endpoints.
- Performing synchronous file I/O operations (`fs.readFileSync`) inside high-frequency request paths.

## Validation Requirements
- Execute backend automated test suite: `node backend/test/verify_all.js`.
- Test endpoints with both valid and boundary-invalid payloads.
- Verify status codes (200, 201, 400, 401, 403, 404, 500).

## Security Considerations
- Sanitize query parameters and inputs to prevent injection attacks.
- Verify JWT tokens and user ownership on every private resource.
- Keep `JWT_SECRET`, database URIs, and API credentials in environment variables.
