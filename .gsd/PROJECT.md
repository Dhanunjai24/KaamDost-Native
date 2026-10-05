# KaamDost Native — Project Overview

## Core Stack
- **Framework**: React Native 0.76.5 (Android Application)
- **Monorepo Structure**:
  - `KaamDostCustomer`: Customer booking & discovery application (`com.kaamdost.customer`)
  - `KaamDostPartner`: Worker partner & job operations application (`com.kaamdost.partner`)
  - `AdminAndOps`: Operational dashboards and administrative control
  - `shared/`: Shared glassmorphic design system tokens, components, and contexts

## Design Architecture
- **Theme**: 2-Color Glassmorphic System
  - Theme 1 (Default): Light Slate Background (`#F4F6F9`) + Navy Blue Primary (`#0D2040`)
  - Theme 2: Crisp White (`#F8FAFC`) + Deep Teal (`#0C4A45`)
  - Theme 3: Soft Warm Ivory (`#F7F5F0`) + Deep Indigo (`#1E1B4B`)
- **Key Tokens**:
  - Glass Surface: `rgba(255, 255, 255, 0.72)` with blur, soft border (`rgba(13, 32, 64, 0.08)`) and elevation shadow.
  - Typography: Navy Blue high-contrast headers, numbers, and accents.

## Build Configuration
- **Compile SDK**: 35 (Android 15)
- **Target SDK**: 34
- **Min SDK**: 24 (Android 7.0)
- **NDK**: 26.1.10909125
- **Gradle**: 8.9 with Android Gradle Plugin 8.7.2
- **Core Dependencies**:
  - `react-native-screens`: `3.35.0`
  - `@react-native-async-storage/async-storage`: `^1.24.0`
  - `react-native-safe-area-context`: `^5.10.1`
  - `react-native-image-picker`: `^8.2.1`
  - `@react-native-community/geolocation`: `^3.4.0`
