---
name: deployment
description: Standards for building, containerizing, deploying, and monitoring KaamDost.
---

# DevOps & Deployment Automation Skill

## Purpose
Ensure dependable, reproducible, and automated build, containerization, deployment, and health monitoring pipelines for KaamDost services.

## When to Use
- Modifying Docker container specifications or multi-stage build workflows.
- Updating cloud deployment manifests (`render.yaml`, `Procfile`).
- Configuring process monitors, reverse proxies, and port forwarding.
- Verifying production readiness, rolling deployments, and rollback strategies.

## Technical Standards
- Use lightweight, secure base images (e.g., `node:20-alpine`).
- Separate build stages from runtime stages to keep production images minimal.
- Implement explicit health checks (`HEALTHCHECK` in Docker, `/api/health` probes in Render).
- Ensure graceful shutdown handling (`SIGTERM` / `SIGINT`) to drain active connections cleanly.
- Maintain environment variables in accordance with `.env.example`.

## Common Mistakes
- Running containers as the `root` user in production.
- Baking environment secrets into Docker images or build layers.
- Deploying without running integration tests and health verification first.
- Failing to document rollback commands for emergency incidents.

## Validation Requirements
- Docker build completes cleanly: `docker build -t kaamdost .`.
- Health check endpoint responds with 200 OK within 5 seconds.
- Verify production server boots without missing environment variable crashes.

## Security Considerations
- Keep Docker base images updated to patch base OS vulnerabilities.
- Restrict open container ports strictly to necessary service listeners.
- Use TLS/HTTPS termination on all production traffic.
