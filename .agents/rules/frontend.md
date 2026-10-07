# KaamDost Frontend & Mobile Rules

## 1. Reusable Component First
- Reuse established Glassmorphism components (`GlassBackground`, `GlassCard`, `GlassButton`, `ThemeSwitcherModal`) before creating custom wrappers.
- Rely on shared design tokens (`theme.js`) rather than hardcoding ad-hoc hex colors.

## 2. Dynamic 4-Theme Consistency
- Respect the active theme provided by `useTheme()`.
- Support all 4 color systems:
  - `slate_orange` (Hero Partner)
  - `light_navy` (Default Customer)
  - `white_teal` (Mint & Teal)
  - `ivory_indigo` (Warm Ivory & Indigo)
- Dynamically toggle typography, background, status bar, and borders to ensure contrast in both dark and light modes.

## 3. Five-State UI Completeness
Every primary screen and list view must support:
1. **Loading State**: Activity spinners or glass skeleton loaders.
2. **Success / Active State**: Data populated cleanly.
3. **Empty State**: Friendly illustration or message when no bookings/jobs exist.
4. **Error State**: Actionable error message with a retry button.
5. **Offline / Network Failure State**: Banner or cached view indicating connectivity disruption.

## 4. Form UX & Duplicate Prevention
- Validate inputs client-side before dispatching network requests.
- Disable submit buttons immediately upon click to prevent double-charging or duplicate bookings.
- Provide clear inline error messages for invalid phone numbers or missing fields.

## 5. Mobile Ergonomics
- Ensure touch targets are at least 48x48 dp for outdoor single-handed use.
- Handle safe area insets on Android and iOS using `SafeAreaView` / `SafeAreaProvider`.
