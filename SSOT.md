# Single Source of Truth: Pavilion 2026 (SSOT)

## 1. Core Identity & Strategy
- **Project**: PAV 2026 Retreat Web App (2026-pav-retreat-vercel)
- **Theme**: **"WATCH & FOLLOW"** (그들이 주를 보며 배우고 따라가는 수련회)
- **Design Concept**: **"The Celestial Vista (The Weightless Word)"**
- **Date**: 2026-04-17 ~ 04-19
- **Location**: Moirs Point Christian Centre, Mangawhai
- **Creative North Star**: A weightless, digital sanctuary. No lines, only light and tonal shifts.
- **Tone**: Professional, editorial, and spiritual.

---

## 2. Technical Stack
- **Framework**: Next.js 15.5.14 (App Router)
- **Styling**: Tailwind CSS v4 + PostCSS
- **Data Source**: Google Sheets API v4
- **Auth**: Google OAuth (Refresh Token Flow)
- **Hosting**: Vercel

---

## 3. Design Tokens (Celestial Vista)

### Colors (Vibrant/Light)
- `primary`: `#005ea0` (Deep Sky)
- `primary-container`: `#46a5ff`
- `surface`: `#f5f7f9` (Sky Light)
- `surface-container-low`: `#eef1f3`
- `surface-container-lowest`: `#ffffff` (Card Base)
- `accent`: `#0099FF`

### Typography (Editorial)
- **Display/Headline**: `Plus Jakarta Sans` (Geometric, Modern)
- **Scripture/Body**: `Noto Serif KR` (Traditional, Sacred)
- **Labels/Utility**: `Manrope` (Clean, Technical)

### UI Rules
- **No-Line Rule**: Strictly avoid 1px solid borders. Use tonal shifts (`surface` vs `surface-container`) to define boundaries.
- **Glassmorphism**: `bg-white/70`, `backdrop-blur-24`.
- **Asymmetric Focus**: Use uneven margins (e.g. `pl-20 pr-12`) to create a more dynamic, editorial feel.
- **Card Radius**: `xl` (1.5rem/24px).

---

## 4. Project Identity
- **Project Name**: 2026-pav-retreat-vercel
- **Production URL**: [https://2026-pav-retreat-vercel.vercel.app/](https://2026-pav-retreat-vercel.vercel.app/)
- **Google Sheet ID**: `1KJkz7kP5mH_51v7tlwnseu2RS3TDbqxQCW6gj8eML_I`
- **Primary Sheets**: 
    - `Attendance`: [Class, Name, Status] - Real-time registration.
    - `Notice`: [ID, Content, Author, Time] - Announcements.
- **DB Pipeline**: **"Fetch-Compare-Apply"** (Bulk Merge/Merge Logic) to prevent data overwrite.

---

## 5. Development Standards
- **Respond First, Execute Later**: Always answer the user in Korean, then execute.
- **Interactive UI**: Use diagrams or carousels to report progress.
- **Systematic Debugging (S-71)**: Follow the H-E-R (Hypothesis-Experiment-Result) cycle for any failures.
