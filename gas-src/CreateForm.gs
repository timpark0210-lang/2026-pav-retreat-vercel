/**
 * 2026 PAV 수련회 참가 신청 구글 폼 생성 스크립트 (V3 - 슬림화 버전)
 * [승인된 지침] 섹션 3개로 통합, 모든 안내문(계좌/차량) 인트로에 집중 배치.
 */

const FORM_TITLE = "2026 PAV Retreat Registration: \"Watch and Follow\"";
const FORM_DESCRIPTION = "안녕하세요, PAV 부모님과 학생 여러분! 2026년 파브 수련회가 망가와이(Mangawhai)에서 열립니다. " +
  "이번 수련회를 통해 주님을 바라보고 따르는 귀한 시간이 되길 소망합니다.\n\n" +
  "■ 일시: 2026년 4월 17일(금) ~ 19일(주일)\n" +
  "■ 장소: Moirs Point Christian Centre, Mangawhai\n" +
  "■ 회비: $120 (NZD)\n" +
  "  * 최근 물가 상승으로 인해 부득이하게 회비를 인상하게 되었습니다. 성도님들의 너그러운 양해를 부탁드립니다.\n" +
  "  * 할인: 목회자 자녀 50%($60), 새친구 무료\n\n" +
  "■ 회비 입금 정보:\n" +
  "  - Account Name: KYOUNGHEE LEE\n" +
  "  - Account Number: 06-0293-0328156-01\n" +
  "  - Reference: [Student Name] Retreat\n\n" +
  "■ 차량 이동 안내 (중요):\n" +
  "  - 금요일: 오전 9시 교회 집결 / 오후 1시 교회 출발\n" +
  "  - 주일: 오후 1시 현지 출발\n\n" +
  "준비를 위해 아래 내용을 정확히 입력해 주시기 바랍니다.";

function createPAVRetreatForm() {
  const form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION);
  
  form.setAllowResponseEdits(true);
  form.setCollectEmail(true);

  // [섹션 1: 신상 및 연락처 (Basic Info)]
  form.addSectionHeaderItem().setTitle("[섹션 1: 신상 및 연락처 (Basic Info)]");
  form.addTextItem().setTitle("1. 학생 성명 (Full Name)").setRequired(true);
  form.addDateItem().setTitle("2. 생년월일 (Date of Birth)").setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle("3. 성별 (Gender)")
    .setHelpText("숙소 배정에 필요합니다.")
    .setChoiceValues(["남", "여"])
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle("4. 현재 학년 (Year Level)")
    .setChoiceValues(["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"])
    .setRequired(true);
  form.addTextItem().setTitle("5. 보호자 성함 (Parent Name)").setRequired(true);
  form.addTextItem().setTitle("6. 비상 연락처 (Emergency Contact Number)").setRequired(true);

  // [섹션 2: 참석 여부 및 동의 (Registration)]
  form.addPageBreakItem().setTitle("[섹션 2: 참석 여부 및 동의 (Registration)]");
  form.addMultipleChoiceItem()
    .setTitle("7. 수련회 참석 여부")
    .setChoiceValues(["참석 (Full Time)", "불참 (Not Attending)", "미정 (Undecided - 사유를 아래에 적어주세요)"])
    .setRequired(true);
  form.addTextItem().setTitle("8. [옵션] 불참 또는 미정 사유");
  form.addCheckboxItem()
    .setTitle("9. 참가 동의 및 면책 확인 (Parental Consent)")
    .setHelpText("본인은 자녀가 2026 PAV 수련회에 참가하는 것에 동의하며, 수련회 기간 중 안전 수칙을 준수하도록 지도하겠습니다.")
    .setChoiceValues(["확인 및 동의함"])
    .setRequired(true);

  // [섹션 3: 건강 및 차량 지원 (Misc Information)]
  form.addPageBreakItem().setTitle("[섹션 3: 건강 및 차량 지원 (Misc Information)]");
  form.addMultipleChoiceItem()
    .setTitle("10. Dietary Requirements (알러지 및 식단)")
    .setChoiceValues(["없음", "채식 (Vegetarian)", "글루텐 프리 (Gluten-free)", "특정 음식 알러지 (아래 상세 기록 요청)"])
    .setRequired(true);
  form.addParagraphTextItem().setTitle("11. 상세 음식 알러지 및 주의사항");
  form.addParagraphTextItem().setTitle("12. 지병 및 상시 복용 약 (Medical Conditions)");
  
  form.addMultipleChoiceItem()
    .setTitle("13. 학부모 차량 및 운전 지원 (Volunteer Driver)")
    .setHelpText("학생들의 안전한 이동을 위해 차량 지원 및 운전 봉사를 해주실 수 있는 부모님께서는 선택해 주세요.")
    .setChoiceValues([
      "금요일 출발 지원 (오후 1시 교회 출발)",
      "주일 복귀 지원 (오후 1시 현지 출발)",
      "왕복 모두 지원 가능",
      "해당 사항 없음"
    ])
    .setRequired(true);

  const seatItem = form.addTextItem()
    .setTitle("14. 차량 내 탑승 가능한 총 학생 수 (Seats Available)")
    .setHelpText("드라이버 제외, 차량에 탑승 가능한 전체 학생 좌석 수를 적어주세요. (운영본부 배차용)");
  
  const textValidation = FormApp.createTextValidation()
    .requireNumber()
    .build();
  seatItem.setValidation(textValidation);

  // 스프레드시트 연동
  try {
    const ssId = "14sEfiQb-Rb42Utt-cpKGjt2GOnldb4N8dbhwcGCPD3A";
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);
  } catch (e) {
    console.error("스프레드시트 연동 실패: " + e.toString());
  }

  const pubUrl = form.getPublishedUrl();
  
  // MainData 시트 업데이트
  try {
    updateMainData({ 'retreat_form_url': pubUrl });
  } catch (e) {}

  Logger.log("=== 구글 폼 생성 완료 (3단계 슬림화 버전) ===");
  Logger.log("Published URL: " + pubUrl);
  return pubUrl;
}
