---
name: postgres
description: Standards for schema design, migrations, indexing, and transactions in PostgreSQL.
---

# PostgreSQL Database Architecture Skill

## Purpose
Govern the relational data model, transaction management, indexing, and schema migrations for KaamDost.

## When to Use
- Designing new tables or modifying existing schemas (`schema.sql`).
- Authoring database migration scripts.
- Writing complex spatial queries (e.g., finding nearby active workers using PostGIS).
- Optimizing slow queries or resolving deadlocks.

## Technical Standards
- Use explicit primary keys (`UUID` or `BIGSERIAL`) and foreign keys with constraint naming conventions.
- Explicitly set `NOT NULL` constraints with appropriate defaults.
- Use atomic transactions (`BEGIN ... COMMIT / ROLLBACK`) for multi-table financial operations (bookings, wallet credits, commissions).
- Maintain timestamp columns (`created_at`, `updated_at`) with timezone awareness (`TIMESTAMPTZ`).
- Add indexes on foreign keys, status flags, and frequently filtered fields.

## Common Mistakes
- Missing `DOWN` rollback logic in migration scripts.
- Using `SELECT *` in high-throughput endpoints instead of projecting required columns.
- Performing unbounded table scans on growing tables (e.g., bookings, audit logs).
- Forgetting to handle connection pooling, leading to connection exhaustion.

## Validation Requirements
- Verify schema migrations against a local development PostgreSQL instance.
- Execute query `EXPLAIN ANALYZE` to ensure index usage and eliminate sequential scans.
- Confirm rollback scripts successfully restore the previous schema without data loss.

## Security Considerations
- Enforce principle of least privilege on application database users (no superuser privileges).
- Use parameterized SQL queries (`$1, $2`) exclusively to eliminate SQL injection.
- Encrypt sensitive columns (e.g., bank account details) at rest where applicable.
