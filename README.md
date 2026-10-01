# 📱 KaamDost - React Native Android Apps

Complete native React Native mobile implementation for **KaamDost** (Telangana's On-Demand Labour & Skilled Trades Marketplace).

Converted from DOM/web JavaScript to **100% Native Views** (`View`, `Text`, `TouchableOpacity`, `ScrollView`, `TextInput`, `Modal`, `FlatList`, `Image`, `StyleSheet`, `StatusBar`, `SafeAreaView`) with direct native Android Gradle project setups for both applications.

---

## 🏗️ Repository Architecture

```
KaamDost-Native/
├── shared/                             <-- Shared domain & design layer
│   ├── constants/
│   │   ├── trades.js                   <-- 13 Telangana Trade Categories & daily rates
│   │   ├── cities.js                   <-- 40 Telangana cities, districts & Indian states
│   │   └── states.js                   <-- Job lifecycle state machine (REQUESTED -> RATED)
│   ├── theme/
│   │   └── theme.js                    <-- Native design tokens (Colors, Typography, Elevation)
│   ├── i18n/
│   │   └── index.js                    <-- Multilingual engine (Telugu, Hindi, English, Marathi, etc.)
│   └── api/
│       └── client.js                   <-- Full REST API client (Emulator, LAN & Production fallback)
│
├── KaamDostCustomer/                   <-- App 1: Customer Booking App (com.kaamdost.customer)
│   ├── package.json
│   ├── app.json
│   ├── index.js
│   ├── App.js
│   ├── android/                        <-- Native Android Gradle setup (build.gradle, Manifest, Kotlin)
│   └── src/
│       ├── components/
│       │   ├── Header.js               <-- Location picker, notifications, language & avatar
│       │   ├── HeroBanner.js           <-- Search bar, voice trigger & trust metrics
│       │   ├── ServiceGrid.js          <-- 13 Telangana trade categories responsive grid
│       │   ├── ActiveBookingCard.js    <-- Real-time order progress & OTP badge
│       │   ├── WorkerCard.js           <-- Worker list item with rating, wage & distance
│       │   ├── LanguageSelectModal.js  <-- Language picker modal
│       │   ├── BookingModal.js         <-- Multi-step booking drawer & price breakdown
│       │   ├── PaymentModal.js         <-- UPI, Card & Cash on Completion checkout
│       │   ├── RatingTipModal.js       <-- 5-star rating, compliment tags & tip selector
│       │   ├── ChatModal.js            <-- Real-time messaging with worker
│       │   ├── NotificationsModal.js   <-- Job updates & wallet notifications
│       │   ├── HelpModal.js            <-- FAQ & 24/7 SOS helpline
│       │   ├── LegalPolicyModal.js     <-- Telangana Labour Welfare compliance
│       │   └── WorkerProfileModal.js   <-- Full worker bio, skills & call action
│       └── screens/
│           ├── LanguageSelectScreen.js <-- Onboarding language selection
│           ├── PhoneLoginScreen.js     <-- Mobile number & 6-digit OTP verification
│           ├── CustomerRegisterScreen.js <-- Name, email & referral code (Step 3)
│           ├── CustomerAddressScreen.js  <-- Gender & GPS Address form (Step 4)
│           ├── CustomerAadhaarScreen.js  <-- 12-digit Aadhaar & live selfie (Step 5)
│           ├── AccountCompleteScreen.js  <-- 5-point verification checklist (Step 6)
│           ├── CustomerHomeScreen.js     <-- Main dashboard with bottom navigation
│           ├── FindWorkersScreen.js      <-- Filtered worker discovery & search
│           ├── TrackingScreen.js         <-- Real-time order tracking & Start OTP
│           ├── CustomerDashboardScreen.js<-- Wallet, saved addresses & booking history
│           └── CustomerSupportScreen.js  <-- AI support chatbot & FAQs
│
├── KaamDostPartner/                    <-- App 2: Worker Partner App (com.kaamdost.partner)
│   ├── package.json
│   ├── app.json
│   ├── index.js
│   ├── App.js
│   ├── android/                        <-- Native Android Gradle setup (build.gradle, Manifest, Kotlin)
│   └── src/
│       ├── components/
│       │   ├── PartnerHeader.js        <-- Duty badge (Online/Offline) & partner info
│       │   ├── DutyToggle.js           <-- Dispatch availability toggle
│       │   ├── JobRequestModal.js      <-- 30s countdown incoming job alert
│       │   ├── ActiveJobCard.js        <-- Navigation, Start OTP input & complete job
│       │   ├── EarningsCard.js         <-- Today's earnings & instant payout
│       │   └── PayoutModal.js          <-- Direct bank / UPI instant withdrawal
│       └── screens/
│           ├── PartnerLoginScreen.js   <-- Partner phone & OTP login
│           ├── PartnerRegisterScreen.js<-- Trade, daily wage, skills & region
│           ├── PartnerKycScreen.js     <-- Aadhaar & Bank Account linking
│           ├── PartnerDashboardScreen.js<-- Command center & simulator
│           ├── PartnerEarningsScreen.js<-- Daily/weekly ledger & transactions
│           ├── PartnerProfileScreen.js <-- Performance stats, badge & reviews
│           └── PartnerSupportScreen.js <-- Labour welfare dispute & SOS hotline
│
└── AdminAndOps/
    └── AdminDashboardScreen.js         <-- Platform KPIs, KYC approval queue & AI engine
```

---

## 🔄 Complete Component & View Conversion Map

| Original Web Component (`public/js/components/`) | Converted Native React Native Component / Screen |
| :--- | :--- |
| `header.js` | `KaamDostCustomer/src/components/Header.js` |
| `hero.js` | `KaamDostCustomer/src/components/HeroBanner.js` |
| `services.js` | `KaamDostCustomer/src/components/ServiceGrid.js` |
| `findWorkers.js` | `KaamDostCustomer/src/screens/FindWorkersScreen.js` |
| `workerProfile.js` | `KaamDostCustomer/src/components/WorkerProfileModal.js` |
| `bookingModal.js` | `KaamDostCustomer/src/components/BookingModal.js` |
| `trackingView.js` | `KaamDostCustomer/src/screens/TrackingScreen.js` |
| `paymentModal.js` | `KaamDostCustomer/src/components/PaymentModal.js` |
| `ratingTipModal.js` | `KaamDostCustomer/src/components/RatingTipModal.js` |
| `customerHome.js` | `KaamDostCustomer/src/screens/CustomerHomeScreen.js` |
| `customerLogin.js` / `authModal.js` | `KaamDostCustomer/src/screens/PhoneLoginScreen.js` |
| `customerRegister.js` | `KaamDostCustomer/src/screens/CustomerRegisterScreen.js` |
| `customerStep4.js` | `KaamDostCustomer/src/screens/CustomerAddressScreen.js` |
| `customerStep5.js` | `KaamDostCustomer/src/screens/CustomerAadhaarScreen.js` |
| `customerStep6.js` | `KaamDostCustomer/src/screens/AccountCompleteScreen.js` |
| `customerDash.js` | `KaamDostCustomer/src/screens/CustomerDashboardScreen.js` |
| `customerSupport.js` | `KaamDostCustomer/src/screens/CustomerSupportScreen.js` |
| `chatModal.js` | `KaamDostCustomer/src/components/ChatModal.js` |
| `notificationsModal.js` | `KaamDostCustomer/src/components/NotificationsModal.js` |
| `helpComponent.js` | `KaamDostCustomer/src/components/HelpModal.js` |
| `legalPolicyModal.js` | `KaamDostCustomer/src/components/LegalPolicyModal.js` |
| `languageSelect.js` | `KaamDostCustomer/src/screens/LanguageSelectScreen.js` |
| `workerReg.js` | `KaamDostPartner/src/screens/PartnerRegisterScreen.js` & `PartnerKycScreen.js` |
| `workerDash.js` | `KaamDostPartner/src/screens/PartnerDashboardScreen.js` & `JobRequestModal.js` |
| `adminPanel.js` / `aiHq.js` | `AdminAndOps/AdminDashboardScreen.js` |

---

## 🚀 Running on Android

### 1. KaamDost Customer App
```bash
cd KaamDostCustomer
npm install
npx react-native run-android
```
Or directly via Gradle:
```bash
cd KaamDostCustomer/android
./gradlew assembleDebug
```

### 2. KaamDost Partner App
```bash
cd KaamDostPartner
npm install
npx react-native run-android
```
Or directly via Gradle:
```bash
cd KaamDostPartner/android
./gradlew assembleDebug
```

---

## 🌐 Pushing to a Separate GitHub Repository

This repository is already initialized with `git init -b main`.
To connect and push to your new GitHub repository:

1. Create a new empty repository on GitHub named `KaamDost-Native` (or your preferred name) under your account `Dhanunjai24`.
2. Run these commands from inside `KaamDost-Native/`:

```bash
cd c:\Users\pathl\OneDrive\Desktop\KaamDost\KaamDost-Native

# Add remote
git remote add origin https://github.com/Dhanunjai24/KaamDost-Native.git

# Stage all files
git add .

# Commit
git commit -m "feat: Initial commit of KaamDost React Native Android Apps (Customer & Partner)"

# Push to main
git branch -M main
git push -u origin main
```
