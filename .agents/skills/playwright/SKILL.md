---
name: playwright
description: Standards for automated end-to-end testing of KaamDost web portals.
---

# Playwright Browser Automation Skill

## Purpose
Automate cross-browser testing for KaamDost web interfaces (`customer-app`, `worker-app`, `frontend` admin portal) to verify end-to-end user journeys.

## When to Use
- Creating or executing E2E regression tests for booking, duty toggle, and payments.
- Validating UI responsiveness across mobile, tablet, and desktop viewports.
- Verifying authentication and OTP login flows in real browser environments.
- Capturing screenshots and video recordings of test runs.

## Technical Standards
- Use robust user-facing locators (`getByRole`, `getByText`, `getByLabel`, `getByTestId`).
- Avoid brittle XPath or CSS selector paths that break on styling refactors.
- Leverage explicit assertions (`expect(locator).toBeVisible()`) with automatic waiting.
- Isolate test state: seed unique test users or clear storage between scenarios.
- Run tests headlessly in CI and headed during local debugging.

## Common Mistakes
- Using hardcoded `page.waitForTimeout(5000)` instead of waiting for explicit elements or network responses.
- Sharing mutable state across parallel test workers.
- Neglecting mobile viewport emulation when testing responsive layouts.

## Validation Requirements
- Test suite passes cleanly with zero intermittent flakiness.
- Test artifacts (traces, screenshots on failure) are properly generated and inspected.

## Security Considerations
- Never hardcode production credentials or API keys in test scripts.
- Ensure automated test scripts run against dedicated test environments, not production databases.
