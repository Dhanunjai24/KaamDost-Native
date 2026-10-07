---
name: react-native
description: Standards for KaamDost native customer and partner apps on Android and iOS.
---

# React Native Mobile Development Skill

## Purpose
Govern mobile architecture, component lifecycle, navigation, and device hardware integration across `KaamDostCustomer` and `KaamDostPartner`.

## When to Use
- Developing or updating native screens, modals, or navigation flows.
- Interfacing with native modules (GPS location, Camera, Haptics, Push Notifications).
- Styling with KaamDost dynamic themes and Glassmorphism design tokens.
- Debugging Metro packager or Android Gradle build issues.

## Technical Standards
- Leverage `shared/` design tokens and components (`GlassBackground`, `GlassCard`, `GlassButton`, `ThemeSwitcherModal`).
- Wrap applications in `SafeAreaProvider` and consume `useTheme()` for all styling.
- Ensure 4-theme dynamic adaptability:
  - `slate_orange` (Partner Hero)
  - `light_navy` (Default Customer)
  - `white_teal` (Mint & Teal)
  - `ivory_indigo` (Ivory & Indigo)
- Optimize list rendering using `FlatList` with `keyExtractor` and `getItemLayout` for large datasets.
- Gracefully handle Android hardware back button via `BackHandler`.

## Common Mistakes
- Hardcoding absolute pixel dimensions instead of using responsive percentages or flexbox.
- Forgetting `StatusBar` theme synchronization (`barStyle={theme.isDark ? 'light-content' : 'dark-content'}`).
- Memory leaks from unremoved event listeners in `useEffect` cleanup callbacks.
- Running unmemoized calculations inside heavy render trees.

## Validation Requirements
- Verify Metro bundler returns HTTP 200 on `http://127.0.0.1:8081/index.bundle`.
- Test on physical Android device or emulator via ADB.
- Capture screenshot evidence confirming zero layout clipping or text overlap.

## Security Considerations
- Store auth tokens securely using encrypted storage rather than plaintext preferences.
- Request Android runtime permissions (Location, Camera) only with contextual explanations.
- Never log full Aadhaar numbers or OTP credentials to the Android Logcat console.
