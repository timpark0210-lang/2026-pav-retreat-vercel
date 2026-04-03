# **🎯 2026 PAV 수련회 웹 앱 & 구글 폼 프로젝트 SSOT (Single Source of Truth)**

## **1. 프로젝트 개요**
- **목표**: 2026 PAV 청소년부 수련회 참가 신청 자동화 및 관리 효율화
- **주제**: "Watch & Follow" (요한복음 14:12)
- **일정**: 2026년 4월 17일(금) ~ 19일(주일)
- **장소**: Moirs Point Christian Centre, Mangawhai

## **2. 기술 스택 및 인프라**
- **백엔드/서버**: Google Apps Script (GAS)
- **프론트엔드**: HTML, CSS, JavaScript (Vanilla JS/CSS)
- **데이터베이스**: Google Spreadsheet (ID: `14sEfiQb-Rb42Utt-cpKGjt2GOnldb4N8dbhwcGCPD3A`)
  - `StudentList`: 학생 명단 (반, 이름)
  - `Attendance`: 신청 현황 및 출석 (반, 이름, 신청현황)
  - `MainData`: 웹 앱 메인 화면 콘텐츠 및 동적 링크 (`retreat_form_url`)
- **버전 관리**: GitHub (master branch)
  - 저장소: [2026-pav-retreat-gas-app](https://github.com/timpark0210-lang/2026-pav-retreat-gas-app)

## **3. 구글 폼 (Google Forms) 핵심 로직**
- **제목**: 2026 PAV Retreat Registration: "Watch and Follow"
- **섹션 구성**:
  1. **안내 및 환영**: 일시, 장소, 회비($120), 할인 정책(목회자 자녀 50%, 새친구 무료) 명시
  2. **학생 정보**: 이름, 생년월일, 성별, **현재 학년(Year 7-13)**
  3. **참석 여부**: 참석, 불참, 미정
  4. **건강 정보**: Dietary Requirements (NZ English 기준: Vegetarian, Gluten-free 등), 알러지, 지병
  5. **차량 지원**: 금요일 1시 교회 출발/주일 1시 현지 출발 일정 안내. 학부모 지원 옵션 및 탑승 가능 인원(숫자) 수집
  6. **동의서**: 보호자 정보 및 참가 동의서 확인
- **자동화**: `CreateForm.gs` 실행 시 폼 자동 생성 -> 스프레드시트 연동 -> `MainData` 시트에 URL 자동 업데이트

## **4. 회비 납부 정보**
- **Account Name**: KYOUNGHEE LEE
- **Account Number**: 06-0293-0328156-01
- **Reference**: [Student Name] Retreat

## **5. 웹 앱 UI 정책**
- **Hero Section**: 가장 눈에 띄는 위치에 '참가 신청' 버튼 배치 (`#FFD700` 골드 컬러)
- **동적 연동**: 백엔드(`Code.gs`) 호출 시 `MainData` 시트에서 최신 폼 URL을 가져와 버튼에 주입함.

## **6. 배포 및 백업 전략**
- **GAS 서버**: `clasp push -f`를 통해 동기화
- **GitHub**: `git push origin master`를 통해 형상 관리
- **업데이트 가이드**: 폼 구조 변경 시 `CreateForm.gs` 수정 후 `createPAVRetreatForm` 함수 재실행 필수.
## **7. 사용자 권한 및 보안 정책 (Phase 21)**
- **학부모/일반 사용자**:
  - 홈(공지), 시간표, **학생 명단(학생명단 탭)** 조회 가능.
  - 학생 명단 조회 시 '서버 저장', 'DB 확인', '명단 편집' 버튼은 숨김 처리.
- **관리자/교사**:
  - '참가 명단' 탭 클릭 시 **커스텀 보안 모달**을 통해 암호(`pav2026`)를 입력합니다. (보안상의 이유로 브라우저 기본 `prompt()`는 사용하지 않음)
  - 암호 입력창에는 절대 실제 암호를 노출하지 않으며, `input type="password"`를 사용하여 가독성과 보안을 확보합니다.
  - 암호 인증 시 출석 체크, 초청 현황 수정, 서버 저장 및 DB 확인 기능 활성화.
  - 게시판 상단의 '새소식 올리기' 및 기존 공지 수정/삭제 권한 부여.
