---
name: security
description: Standards for vulnerability scanning, threat modeling, and secure coding in KaamDost.
---

# Application Security & Hardening Skill

## Purpose
Audit, prevent, and remediate security vulnerabilities across KaamDost's APIs, web interfaces, mobile apps, and infrastructure.

## When to Use
- Reviewing code for OWASP Top 10 vulnerabilities (Injection, Broken Auth, Sensitive Data Exposure).
- Auditing authentication, authorization, and cryptographic implementations.
- Verifying payment integration security and webhook signature integrity.
- Sanitizing environment variables, secrets, and public-facing error responses.

## Technical Standards
- Apply defense-in-depth: validate inputs at the edge, authenticate tokens, authorize roles, and parameterize queries.
- Use `bcryptjs` with appropriate salt rounds (>= 10) for any password hashing.
- Set secure HTTP headers via `helmet` (HSTS, X-Content-Type-Options, X-Frame-Options).
- Enforce rate limiting on sensitive routes (login, OTP, payment verification).
- Redact PII and secrets from application logs.

## Common Mistakes
- Trusting client-supplied IDs without verifying ownership in the JWT payload.
- Returning detailed database error messages or stack traces to public API clients.
- Allowing unauthenticated webhook execution without verifying provider signatures.
- Storing unencrypted secrets in repositories or client bundles.

## Validation Requirements
- Run `npm audit` to detect dependency vulnerabilities.
- Execute security test scripts simulating unauthorized access attempts.
- Verify `.env` files are excluded from Git commits.

## Security Considerations
- Never expose Razorpay secret keys or webhook secrets to frontend clients.
- Always use constant-time comparison (`crypto.timingSafeEqual`) when validating signatures or tokens.
