# KaamDost Database Rules

## 1. Source of Truth
- The relational model (`schema.sql` / PostgreSQL) is the authoritative architectural blueprint for KaamDost data.
- Dual persistence layers (SQLite and MongoDB adapters) must strictly adhere to relational integrity principles.

## 2. Schema Migrations
- All schema alterations must be accompanied by versioned migration scripts.
- Every migration must include both an `UP` (apply) and a `DOWN` (rollback) path.
- Verify migration syntax and test on development data prior to any staging deployment.

## 3. Relationships & Integrity
- Explicitly declare foreign key constraints for all parent-child records (`customer_id`, `worker_id`, `booking_id`).
- Define explicit `ON DELETE` rules (`CASCADE`, `RESTRICT`, or `SET NULL`).

## 4. Indexing Strategy
- Index foreign key columns and high-frequency search fields (e.g., `phone`, `status`, `trade`, `service_id`).
- Use composite or spatial indexes for geolocation queries where worker proximity is evaluated.

## 5. Transaction Safety
- Wrap multi-table updates (e.g., booking completion + worker wallet balance credit + platform fee deduction) inside atomic database transactions.
- Roll back all changes if any single operation fails.

## 6. Production Safety Protocols
- NEVER drop tables, truncate datasets, or execute unconstrained `DELETE` statements on production databases.
- Automated tools and AI agents are restricted to non-destructive database operations unless explicit human permission is provided.
