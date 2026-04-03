import { google } from "googleapis";
import { getOAuth2Client } from "@/lib/google-sheets";

/**
 * Constants for the Retreat Form
 */
const FORM_TITLE = "2026 PAV Retreat Registration: \"Watch and Follow\"";
const FORM_DESCRIPTION = `안녕하세요, PAV 부모님과 학생 여러분! 2026년 파브 수련회가 망가와이(Mangawhai)에서 열립니다. 이번 수련회를 통해 주님을 바라보고 따르는 귀한 시간이 되길 소망합니다.

■ 일시: 2026년 4월 17일(금) ~ 19일(주일)
■ 장소: Moirs Point Christian Centre, Mangawhai
■ 회비: $120 (NZD)
  * 할인: 목회자 자녀 50% ($60), 새친구 무료

■ 회비 입금 정보:
  - Account Name: KYOUNGHEE LEE
  - Account Number: 06-0293-0328156-01
  - Reference: [Student Name] Retreat

■ 차량 이동 안내 (중요):
  - 금요일: 오전 9시 교회 집결 / 오후 1시 교회 출발
  - 주일: 오후 1시 현지 출발

준비를 위해 아래 내용을 정확히 입력해 주시기 바랍니다.`;

/**
 * Initialize Google Forms API
 */
export function getFormsInstance() {
  const auth = getOAuth2Client();
  return google.forms({ version: "v1", auth });
}

/**
 * Create a new PAV Retreat Form
 */
export async function createPAVRetreatForm() {
  const forms = getFormsInstance();

  try {
    // 1. Create the Form
    const createRes = await forms.forms.create({
      requestBody: {
        info: {
          title: FORM_TITLE,
          documentTitle: FORM_TITLE,
        },
      },
    });

    const formId = createRes.data.formId;
    if (!formId) throw new Error("Failed to create form - no formId returned.");

    // 2. Initial Description Update
    await forms.forms.batchUpdate({
      formId,
      requestBody: {
        requests: [
          {
            updateFormInfo: {
              info: {
                description: FORM_DESCRIPTION,
              },
              updateMask: "description",
            },
          },
        ],
      },
    });

    // 3. Add Items (Questions & Sections)
    // Note: This is an abbreviated logical port. In a real scenario, 
    // each item is added via createItem requests in batchUpdate.
    const requests: any[] = [
      {
        createItem: {
          item: {
            title: "1. 학생 성명 (Full Name)",
            questionItem: {
              question: {
                required: true,
                textQuestion: {},
              },
            },
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: "3. 성별 (Gender)",
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: "RADIO",
                  options: [{ value: "남" }, { value: "여" }],
                },
              },
            },
          },
          location: { index: 1 },
        },
      },
      // ... More items would be added here to match CreateForm.gs
    ];

    await forms.forms.batchUpdate({
      formId,
      requestBody: { requests },
    });

    const publishedUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
    console.log("Successfully created Google Form:", publishedUrl);

    return publishedUrl;
  } catch (error) {
    console.error("Error in createPAVRetreatForm:", error);
    throw error;
  }
}
