# **🎯 2026 PAV 수련회 웹 앱 & 구글 폼 프로젝트 SSOT (Single Source of Truth)**

## **1. 프로젝트 개요**
- **목표**: 2026 PAV 청소년부 수련회 참가 신청 자동화 및 관리 효율화
- **주제**: "Watch & Follow" (요한복음 14:12)
- **일정**: 2026년 4월 17일(금) ~ 19일(주일)
- **장소**: Moirs Point Christian Centre, Mangawhai
- **비전**: GAS 기반 레거시 시스템을 Next.js 기반의 현대적 웹 앱으로 전환하여 사용자 경험과 데이터 관리 효율을 극대화함.

## **2. 기술 스택 및 인프라 (Next.js Migration)**
- **프레임워크**: Next.js 15+ (App Router)
- **프론트엔드**: React 19, TypeScript
- **스타일링**: **Tailwind CSS v4** (Glassmorphism & Premium UI focus)
- **데이터 저장소**: Google Spreadsheet (ID: `14sEfiQb-Rb42Utt-cpKGjt2GOnldb4N8dbhwcGCPD3A`)
  - `StudentList`: 학생 명단 (반, 이름)
  - `Attendance`: 신청 현황 및 출석 (반, 이름, 신청현황)
  - `MainData`: 웹 앱 메인 화면 콘텐츠 및 동적 링크 (`retreat_form_url`)
- **API 연동**: `google-auth-library`, `googleapis` (Node.js SDK)
- **인프라/배포**: Vercel (Production), Local-First development
- **버전 관리**: GitHub (main branch)
  - 저장소: [pav-retreat-vercel](https://github.com/timpark0210-lang/pav-retreat-vercel)

## **3. 구글 폼 (Google Forms) 핵심 로직**
- **제목**: 2026 PAV Retreat Registration: "Watch and Follow"
- **섹션 구성**: 안내/환영, 학생 정보, 참석 여부, 건강 정보, 차량 지원, 동의서 수집
- **자동화**: Next.js 관리자 페이지에서 `createForm` API 호출 -> Google Form 생성 -> 스프레드시트 연동 및 `MainData` URL 업데이트.

## **4. 회비 납부 정보**
- **Account Name**: KYOUNGHEE LEE
- **Account Number**: 06-0293-0328156-01
- **Reference**: [Student Name] Retreat
- **Fee**: $120 (할인 정책: 목회자 자녀 50%, 새친구 무료)

## **5. 웹 앱 UI/UX 정책 (Premium Aesthetics)**
- **Hero Section**: 가장 눈에 띄는 위치에 '참가 신청' 버튼 배치 (`#FFD700` 골드 컬러 악센트)
- **Design Token**: Tailwind v4 컨테이너 쿼리 및 다크 모드(Glassmorphism) 기반 디자인.
- **Micro-animations**: Lucide Icons 및 Framer Motion 등을 활용한 부드러운 전환 효과.

## **6. 사용자 권한 및 보안 정책**
- **일반 사용자**: 홈(공지), 시간표, 학생 명단 조회 가능. (편집 기능 제한)
- **관리자/교사**: 
  - **커스텀 보안 모달**을 통해 암호(`pav2026`) 인증.
  - 인증 시 출석 체크, 초청 현황 수정, 서버 저장 및 DB 확인 기능 활성화.
  - 암호 보안: `.env.local`의 `ADMIN_PASSWORD` 환경 변수 사용.

## **7. 관리 수칙**
- **비밀 보장**: 시크릿 정보(`.env.local`)인 `GOOGLE_SERVICE_ACCOUNT_KEY`, `SHEET_ID`, `ADMIN_PASSWORD`는 절대 GitHub에 푸시하지 말 것.
- **데이터 무결성**: 모든 데이터 수정 작업은 `src/services/data-service.ts`를 통해 Google Sheets API로 정합성을 유지하며 진행함.
