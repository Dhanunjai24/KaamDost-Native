# KaamDost Security Rules

## 1. Input Validation & Sanitization
- Every public endpoint must validate incoming request parameters, query strings, and body payloads.
- Use `express-validator` or schema validation before passing data to business logic.
- Sanitize inputs to prevent SQL injection, NoSQL injection, and Cross-Site Scripting (XSS).

## 2. Authentication & JWT Safety
- Validate JWT signatures on all protected endpoints using `authenticateToken` middleware.
- Ensure `JWT_SECRET` has sufficient cryptographic entropy in production.
- Include expiration (`expiresIn`) on all issued tokens.
- Handle token expiration and malformed tokens cleanly with `401 Unauthorized`.

## 3. OTP & SMS Security
- Generate cryptographically secure numeric OTPs.
- Limit OTP attempts per phone number to prevent brute-force attacks (`authLimiter`).
- Never log plaintext OTP codes in production logs.
- Disallow arbitrary phone number manipulation.

## 4. Role-Based Access Control (RBAC)
- Enforce strict role validation (`requireAdminRole` for admin management).
- Verify object ownership: customers may only access their own bookings, addresses, and profiles; workers may only access their own jobs and wallet data.

## 5. Payment Security
- Verify Razorpay webhook signatures using `crypto.createHmac` before updating booking payment states.
- Match transaction amounts against database records to prevent client-side payment tampering.
- Maintain idempotency on payment callbacks to prevent duplicate credits.

## 6. Secrets & Environment Hygiene
- Keep `.env` files in `.gitignore`.
- Maintain `.env.example` with sanitized placeholder keys.
- Never commit private keys, cloud credentials, or database passwords to Git.
