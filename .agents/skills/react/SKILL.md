---
name: react
description: Standards and workflows for KaamDost React web apps, PWAs, and admin dashboards.
---

# React Web & PWA Development Skill

## Purpose
Guide the development and optimization of KaamDost web applications (`customer-app`, `worker-app`, `frontend` admin dashboard), ensuring performant, responsive, and reliable experiences.

## When to Use
- Adding or modifying web portal screens or components.
- Integrating browser-based APIs (Geolocation, Web Notifications, Camera).
- Optimizing PWA caching, service workers, or bundle sizes.
- Debugging state synchronization or render performance.

## Technical Standards
- Use functional components with React Hooks.
- Manage state locally with `useState` / `useReducer` and cross-component context cleanly.
- Enforce strict prop validation and error boundaries.
- Keep bundle size minimal: lazy load routes using `React.lazy` and `Suspense`.
- Implement responsive viewport handling matching mobile and desktop breakpoints.

## Common Mistakes
- Storing sensitive tokens in unencrypted `localStorage` vulnerable to XSS.
- Forgetting loading and error indicators during asynchronous API calls.
- Unnecessary re-renders caused by anonymous functions inside JSX props without `useCallback`.
- Hardcoding static backend URLs instead of using configurable environment variables.

## Validation Requirements
- Build check: `npm run build` must complete without errors.
- Visual inspection across mobile (375px) and desktop (1440px) viewports.
- Verify forms disable submit buttons during in-flight requests.

## Security Considerations
- Never render raw unescaped HTML (`dangerouslySetInnerHTML`) with user-supplied text.
- Sanitize URLs before using them in `href` or `src` attributes.
- Clear authentication tokens on user logout or session expiration.
