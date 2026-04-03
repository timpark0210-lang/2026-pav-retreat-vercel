/**
 * 2026 PAV Youth Retreat Web App Backend
 * Role: API Controller & Sheet Integration
 * Last Updated: 2026-03-24 (Encoding & Deployment Fix Verified)
 */

/**
 * CONSTANTS & CONFIGURATION
 */
const SHEET_ID = '14sEfiQb-Rb42Utt-cpKGjt2GOnldb4N8dbhwcGCPD3A';

// 반(Class)별 선생님 매핑 정보
const GROUP_MAP = {
  '7B': '유주형/문서영',
  '7G': '이수연',
  '8A': '한은종',
  '8B': '조은비',
  '9': '박성광',
  '10': '김경희/차준호',
  '11A': '원진',
  '11B': '김대헌',
  '12,13': '권희운'
};

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🌟 PAV 관리')
    .addItem('포스터/폼 URL 자동 세팅', 'setupInitialData')
    .addToUi();
}

/**
 * [에디터 실행용] 메인 데이터 초기화 함수
 * 시트 메뉴가 안 뜰 경우 에디터에서 이 함수를 선택하고 '실행'을 눌러주세요.
 */
function RUN_INITIAL_SETUP() {
  setupInitialData();
}

function setupInitialData() {
  const defaultData = {
    'hero_image_id': '1emJNOnZDniLZxLhAH6moAkFdaMzlS1Tl',
    'retreat_form_url': 'https://forms.gle/vP7fK9aMscZ6X9N38'
  };
  
  updateMainData(defaultData);
}

const BASE_STUDENT_DATA = {
  "7B (유주형/문서영)": ["구엘리엄", "최재원", "김윤", "장서진", "노원태"],
  "7G (이수연)": ["김예봄", "구엘리나", "김연아"],
  "8A (한은종)": ["정태인", "김주원A", "장하율", "김요한"],
  "8B (조은비)": ["김은결", "최주원", "김한결", "박조수하"],
  "9 (박성광)": ["김지안", "차지운", "정인"],
  "10 (김경희/차준호)": ["장승혜", "김주원B", "문사랑", "최온유", "김하영", "채유담", "조이준", "정세인", "장하준", "이유건", "박존요한"],
  "11A (원진)": ["김민준", "안시우", "임현", "강은민", "김조단"],
  "11B (김대헌)": ["이에린", "조수현", "노유정", "박민준", "안태정"],
  "12,13 (권희운)": ["안건우", "최한나", "차지안", "류지효", "박재우", "박수연", "김은찬"]
};

 // 사용자 스레드시트 ID (업데이트됨)

function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  
  // 구글 폼 URL 및 히어로 이미지 ID 가져오기 (MainData 시트에서 로드)
  let formUrl = "#";
  let heroImageId = '1emJNOnZDniLZxLhAH6moAkFdaMzlS1Tl'; // 신규 포스터 (2026-03-29) 기본값
  
  try {
    const mainData = JSON.parse(getMainData());
    formUrl = mainData['retreat_form_url'] || "#";
    // 시트에서 hero_image_id 가 정의되어 있으면 해당 값을 사용
    if (mainData['hero_image_id']) {
      heroImageId = mainData['hero_image_id'];
    }
  } catch(e) {
    Logger.log("doGet MainData load error: " + e.toString());
  }

  // 템플릿 변수 설정
  template.imageUrls = {
    hero: getImageUrlById(heroImageId)
  };
  template.formUrl = formUrl;

  return template.evaluate()
    .setTitle('2026 파브 청소년부 수련회')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 이미지 파일 ID를 직접 링크 URL로 변환
 */
function getImageUrlById(fileId) {
  if (!fileId) return "";
  return "https://lh3.googleusercontent.com/d/" + fileId;
}

/**
 * 프론트엔드 HTML에서 다른 HTML 파일을 포함시킬 때 참조하는 함수
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * 학생 명단과 출석 상태를 가져오는 API
 * Attendance 시트 실제 연동 + Fallback 데이터 보장
 */
function getStudentData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const listSheet = ss.getSheetByName('StudentList');
    const attendanceSheet = ss.getSheetByName('Attendance');

    let studentList = {};

    // 1. StudentList 시트에서 학생 명단 로드
    if (listSheet && listSheet.getLastRow() > 1) {
      const listData = listSheet.getDataRange().getValues();
      for (let i = 1; i < listData.length; i++) {
        const rawGroup = listData[i][0] ? listData[i][0].toString().trim() : '';
        const studentName = listData[i][1] ? listData[i][1].toString().trim() : '';
        if (rawGroup && studentName) {
          const normalizedGroup = rawGroup.toString().replace('/', ',');
          const teacher = GROUP_MAP[normalizedGroup] || GROUP_MAP[rawGroup] || '';
          const groupName = teacher ? `${normalizedGroup} (${teacher})` : normalizedGroup;
          if (!studentList[groupName]) {
            studentList[groupName] = [];
          }
          studentList[groupName].push({ name: studentName });
        }
      }
    } else {
      for (let group in BASE_STUDENT_DATA) {
         studentList[group] = BASE_STUDENT_DATA[group].map(name => ({name: name}));
      }
    }

    // 2. Attendance 시트에서 출석 정보 로드 (단일 "신청현황" 컬럼 사용)
    let attendanceData = {};
    if (attendanceSheet && attendanceSheet.getLastRow() > 1) {
      const attData = attendanceSheet.getDataRange().getDisplayValues();
      const headers = attData[0].map(h => h.toString().trim());
      
      const groupCol = headers.indexOf('반');
      const nameCol = headers.indexOf('이름');
      const statusCol = headers.indexOf('신청현황');

      for (let i = 1; i < attData.length; i++) {
        const gName = groupCol !== -1 ? attData[i][groupCol].toString().trim() : '';
        const sName = nameCol !== -1 ? attData[i][nameCol].toString().trim() : '';
        
        if (sName && sName !== '총합') {
          // 일관된 키 포맷: "반|이름" (SSOT 기준)
          const key = gName + '|' + sName;
          attendanceData[key] = statusCol !== -1 ? (attData[i][statusCol] || '미정') : '미정';
        }
      }
    }

    // 3. 학생 명단과 출석 정보를 병합
    const result = {};
    for (const groupName in studentList) {
      result[groupName] = studentList[groupName].map(studentObj => {
        const pureGroup = groupName.split(' ')[0];
        const keyLong = groupName + '|' + studentObj.name;
        const keyShort = pureGroup + '|' + studentObj.name;
        
        // 단일 상태값 매핑
        const status = attendanceData[keyLong] || attendanceData[keyShort] || '미정';
        return { name: studentObj.name, attendance: status };
      });
    }

    // -- 4. 수련회 데이터 추가 --
    try {
      const rSheet = ss.getSheetByName('ClassRetreat');
      if (rSheet) {
        const rData = rSheet.getDataRange().getValues();
        const retreatInfo = {};
        for (let i = 1; i < rData.length; i++) {
          if (rData[i][0]) {
            retreatInfo[rData[i][0].toString().trim()] = {
              believer: parseInt(rData[i][1]) || 0,
              nonbeliever: parseInt(rData[i][2]) || 0,
              memo: (rData[i][3] || '').toString()
            };
          }
        }
        result._retreatData = retreatInfo;
      }
    } catch(e) {}

    result._spreadsheetUrl = ss.getUrl();
    return JSON.stringify(result);

  } catch (e) {
    Logger.log("getStudentData error: " + e.toString());
    const fallbackResult = {};
    for (const groupName in BASE_STUDENT_DATA) {
      fallbackResult[groupName] = BASE_STUDENT_DATA[groupName].map(name => ({
        name: name,
        attendance: {}
      }));
    }
    return JSON.stringify(fallbackResult);
  }
}

/**
 * 게시판 공지사항 목록을 가져오는 API
 */
function getAnnouncements() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Notice') || ss.insertSheet('Notice');
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return JSON.stringify([]);

    // 헤더 제외, 빈 행 필터링
    const list = data.slice(1)
      .filter(row => row[1] && row[3]) // 컨텐츠와 타임스탬프가 있는 행만
      .map((row, index) => ({
        id: index + 1,
        content: row[1],
        author: row[2],
        timestamp: row[3] instanceof Date ? row[3].getTime() : row[3], // 타임스탬프 숫자형으로 통일
        fileUrl: row[4] || null,
        fileName: row[5] || null,
        fileType: row[6] || null,
        timeStr: formatDate(row[3])
      }));
    return JSON.stringify(list.reverse()); // 최신순
  } catch (e) {
    Logger.log("getAnnouncements error: " + e.toString());
    return JSON.stringify([{ id: 1, content: "데이터를 불러오는 중 오류가 발생했습니다.", author: "System", timestamp: new Date().getTime(), timeStr: "오류" }]);
  }
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return Utilities.formatDate(date, "GMT+13", "MM/dd HH:mm");
}

/**
 * 새로운 공지사항 추가 (파일 첨부 포함)
 */
function addAnnouncementWithFile(content, author, fileData) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Notice') || ss.insertSheet('Notice');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Content', 'Author', 'Timestamp', 'FileUrl', 'FileName', 'FileType']);
  }

  let fileUrl = "", fileName = "", fileType = "";
  if (fileData) {
    try {
      const folder = getOrCreateFolder("PAV_Retreat_Attachments");
      const blob = Utilities.newBlob(Utilities.base64Decode(fileData.base64), fileData.mimeType, fileData.name);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getDownloadUrl();
      if (!fileData.mimeType.startsWith('image/')) {
        fileUrl = file.getUrl();
      }
      fileName = fileData.name;
      fileType = fileData.mimeType;
    } catch (err) {
      Logger.log("File save error: " + err.toString());
    }
  }

  const now = new Date();
  // Notice 시트 열 구조: [ID, Content, Author, Timestamp, FileUrl, FileName, FileType]
  // Index 1부터 시작하므로:
  // 1: ID (Timestamp와 동일하게 사용)
  // 2: Content (row[1])
  // 3: Author (row[2])
  // 4: Timestamp (row[3])
  // 5: FileUrl (row[4])
  // 6: FileName (row[5])
  // 7: FileType (row[6])
  sheet.appendRow([now.getTime(), content, author, now, fileUrl, fileName, fileType]);
  updateGlobalTimestamp();
  return true;
}

/**
 * 메인 화면 및 앱 데이터 업데이트 (관리자 전용)
 * data: 객체 형태 { key: value, ... } — 여러 키 동시 업데이트 가능
 * 예: updateMainData({ speaker_fri: '양진우', timetable_data: '{...}' })
 */
function updateMainData(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('MainData') || ss.insertSheet('MainData');
    
    if (!data || typeof data !== 'object') {
      Logger.log("updateMainData: No valid data provided.");
      return false;
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Key', 'Value']);
    }
    
    const existingData = sheet.getDataRange().getValues();
    const keysToUpdate = Object.keys(data);
    
    keysToUpdate.forEach(key => {
      let found = false;
      for (let i = 1; i < existingData.length; i++) {
        if (existingData[i][0] === key) {
          sheet.getRange(i + 1, 2).setValue(data[key]);
          found = true;
          break;
        }
      }
      if (!found) {
        sheet.appendRow([key, data[key]]);
      }
    });
    
    updateGlobalTimestamp();
    return true;
  } catch (e) {
    Logger.log("updateMainData error: " + e.toString());
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  const folder = DriveApp.createFolder(folderName);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

/**
 * 게시글 수정
 */
function updateAnnouncement(timestamp, newContent, authPw) {
  if (authPw !== "pav2026") return false; // 서버사이드 암호 검증 추가
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Notice');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowTs = data[i][3] instanceof Date ? data[i][3].getTime() : data[i][3];
    if (rowTs.toString() === timestamp.toString()) {
      sheet.getRange(i + 1, 2).setValue(newContent);
      updateGlobalTimestamp();
      return true;
    }
  }
  return false;
}

/**
 * 게시글 삭제
 */
function deleteAnnouncement(timestamp, authPw) {
  if (authPw !== "pav2026") return false;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Notice');
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    const rowTs = data[i][3] instanceof Date ? data[i][3].getTime() : data[i][3];
    if (rowTs.toString() === timestamp.toString()) {
      sheet.deleteRow(i + 1);
      updateGlobalTimestamp();
      return true;
    }
  }
  return false;
}

/**
 * 전역 상태 타임스탬프 업데이트 (Polling 동기화용)
 */
function updateGlobalTimestamp() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
    sheet.getRange('A1').setValue(new Date().getTime());
  } catch (e) {
    Logger.log("updateGlobalTimestamp error: " + e.toString());
  }
}

/**
 * 전역 상태 Polling API
 */
function getGlobalState() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
    let lastUpdate = sheet.getRange('A1').getValue() || new Date().getTime();
    return JSON.stringify({ timestamp: lastUpdate });
  } catch (e) {
    return JSON.stringify({ timestamp: 0 });
  }
}

/**
 * 출석 및 전역 상태 일괄 업데이트 (Selective Merge & Concurrency Safe)
 * @param {Object} dirtyState 변경된 출석 데이터 { "반|이름": "상태" }
 */
function updateAttendanceBatch(dirtyState, _, dirtyRetreatState) {
  const lock = LockService.getScriptLock();
  try {
    // 30초 대기 (다수 사용자 동시 저장 대비)
    lock.waitLock(30000);
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let attSheet = ss.getSheetByName('Attendance');
    if (!attSheet) {
      attSheet = ss.insertSheet('Attendance');
      attSheet.appendRow(['반', '이름', '신청현황']);
    }

    // 1. 현재 시드 데이터 로드 및 헤더 확인
    let data = attSheet.getDataRange().getValues();
    let headers = data[0].map(h => h.toString().trim());
    let groupColIdx = headers.indexOf('반');
    let nameColIdx = headers.indexOf('이름');
    let statusColIdx = headers.indexOf('신청현황');

    // 필수 컬럼이 없으면 보정
    if (statusColIdx === -1) {
      statusColIdx = 2; // 기본 3번째 열
      attSheet.getRange(1, statusColIdx + 1).setValue('신청현황');
      headers[statusColIdx] = '신청현황';
      data = attSheet.getDataRange().getValues();
    }

    // 2. 기존 학생 행 인덱스 맵 생성 (1-based row index)
    const rowMap = {};
    for (let i = 1; i < data.length; i++) {
        const g = data[i][groupColIdx] || '';
        const n = data[i][nameColIdx] || '';
        if (n === '총합' || g === '총합') continue;
        rowMap[g + '|' + n] = i + 1;
        // 반 이름에서 교사명 제외한 순수 반 이름도 매핑 (호환성)
        const pureG = g.toString().split(' ')[0];
        rowMap[pureG + '|' + n] = i + 1;
    }

    // 3. Selective Merge: dirtyState에 포함된 항목만 개별 셀 업데이트
    for (const key in dirtyState) {
      const status = dirtyState[key];
      const parts = key.split('|');
      if (parts.length < 2) continue;
      
      const rowIndex = rowMap[key];
      if (rowIndex) {
        // 기존 학생 위치에 상태만 업데이트
        attSheet.getRange(rowIndex, statusColIdx + 1).setValue(status);
      } else {
        // 존재하지 않는 경우 새 행 추가
        const newRow = new Array(headers.length).fill('');
        newRow[groupColIdx] = parts[0];
        newRow[nameColIdx] = parts[1];
        newRow[statusColIdx] = status;
        attSheet.appendRow(newRow);
        rowMap[key] = attSheet.getLastRow();
      }
    }

    // 4. 수련회 데이터 업데이트 (있는 경우)
    if (dirtyRetreatState && Object.keys(dirtyRetreatState).length > 0) {
       updateRetreatStatsInternal(ss, dirtyRetreatState);
    }

    // 5. 총합 행 재계산 및 정렬, 포맷팅
    refreshAttendanceSheetFinal(attSheet, statusColIdx);
    
    updateGlobalTimestamp();
    return JSON.stringify({ success: true, timestamp: new Date().getTime() });

  } catch (e) {
    Logger.log("updateAttendanceBatch error: " + e.toString());
    return JSON.stringify({ success: false, error: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function updateRetreatStatsInternal(ss, dirtyRetreatState) {
  const retreatSheet = ss.getSheetByName('ClassRetreat') || ss.insertSheet('ClassRetreat');
  let rData = retreatSheet.getDataRange().getValues();
  if (rData.length === 0 || !rData[0][0]) {
    retreatSheet.appendRow(['반', '초청 기신자수', '초청 새신자수', '비고', '최종업데이트']);
    rData = retreatSheet.getDataRange().getValues();
  }
  
  const rIdxMap = {};
  for (let i = 1; i < rData.length; i++) {
    if (rData[i][0]) rIdxMap[rData[i][0].toString().trim()] = i + 1;
  }
  
  const nowStr = Utilities.formatDate(new Date(), 'Pacific/Auckland', 'yyyy-MM-dd HH:mm:ss');
  for (const groupName in dirtyRetreatState) {
    const info = dirtyRetreatState[groupName];
    const rRow = rIdxMap[groupName];
    const rowData = [groupName, info.believer || 0, info.nonbeliever || 0, info.memo || '', nowStr];
    if (rRow) {
      retreatSheet.getRange(rRow, 1, 1, 5).setValues([rowData]);
    } else {
      retreatSheet.appendRow(rowData);
    }
  }
}

function refreshAttendanceSheetFinal(sheet, statusColIdx) {
  const data = sheet.getDataRange().getValues();
  // 기존 총합 행 모두 삭제
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === '총합' || data[i][1] === '총합') {
      sheet.deleteRow(i + 1);
    }
  }
  
  // [추가] 반(Group) 컬럼(1번째 열) 기준 오름차순 정렬 (헤더 제외)
  const lastRowData = sheet.getLastRow();
  if (lastRowData > 1) {
    sheet.getRange(2, 1, lastRowData - 1, sheet.getLastColumn()).sort(1);
  }
  
  const lastRow = sheet.getLastRow();
  const colLetter = getColumnLetter(statusColIdx + 1);
  const totalRow = ['총합', '총합', ''];
  totalRow[statusColIdx] = `=COUNTIF(${colLetter}2:${colLetter}${lastRow}, "참가") & "명 참가"`;
  
  sheet.appendRow(totalRow);
  const totalRange = sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn());
  totalRange.setBackground('#FFF2CC').setFontWeight('bold');
  
  formatSheetProfessional(sheet, statusColIdx);
}

/**
 * [신규] 학생 명단에 새 학생 추가
 * groupName: 반 이름 (예: "7B (유주형/문서영)")
 * studentName: 학생 이름
 */
function addStudentToList(groupName, studentName) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const listSheet = ss.getSheetByName('StudentList') || ss.insertSheet('StudentList');

    // StudentList 시트 구조: [GroupName, StudentName]
    // 중복 체크
    const data = listSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === groupName && data[i][1] === studentName) {
        return JSON.stringify({ success: false, error: '이미 등록된 학생입니다.' });
      }
    }

    listSheet.appendRow([groupName.trim(), studentName.trim()]);
    updateGlobalTimestamp();
    return JSON.stringify({ success: true, message: `${studentName} 추가 완료` });
  } catch (e) {
    Logger.log("addStudentToList error: " + e.toString());
    return JSON.stringify({ success: false, error: e.toString() });
  }
}

/**
 * [신규] 학생 명단에서 학생 삭제
 */
function removeStudentFromList(groupName, studentName) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const listSheet = ss.getSheetByName('StudentList');
    if (!listSheet) return JSON.stringify({ success: false, error: 'StudentList 시트 없음' });

    const data = listSheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === groupName && data[i][1] === studentName) {
        listSheet.deleteRow(i + 1);
        updateGlobalTimestamp();
        return JSON.stringify({ success: true, message: `${studentName} 삭제 완료` });
      }
    }
    return JSON.stringify({ success: false, error: '학생을 찾을 수 없습니다.' });
  } catch (e) {
    Logger.log("removeStudentFromList error: " + e.toString());
    return JSON.stringify({ success: false, error: e.toString() });
  }
}

/**
 * [신규] 메인 화면 편집 데이터 가져오기
 * MainData 시트: [SectionKey, Content]
 */
function getMainData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('MainData');
    if (!sheet) return JSON.stringify({});

    const data = sheet.getDataRange().getValues();
    const result = {};
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) result[data[i][0]] = data[i][1];
    }
    return JSON.stringify(result);
  } catch (e) {
    Logger.log("getMainData error: " + e.toString());
    return JSON.stringify({});
  }
}

// [통합] updateMainData 는 189번 줄 단일 함수로 통합되었습니다.
// 이전: updateMainData(sectionKey, content) 형태 → 이제 updateMainData({ key: value }) 형태로 통일.

/**
 * [신규] 상세 시간표 데이터 가져오기 (SSOT.md 기반 구조화된 데이터)
 */
function getDetailedTimetable() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Timetable_Detailed') || ss.insertSheet('Timetable_Detailed');
  if (sheet.getLastRow() <= 1) {
    // 초기 데이터 예시 (SSOT.md 내용 기반)
    const initialData = [
      ['Day', 'Time', 'Duration', 'Program', 'Details', 'Bigo'],
      ['1', '09:00 - 10:00', '60분', '개회 예배', '찬양 및 수련회 선포 (강사: 양진우 전도사님)', '교회 본당'],
      ['1', '10:00 - 11:30', '90분', '프로그램 1: 조모임', '조 이름/구호 정하기, 성경구절 및 UCC 주제 뽑기', '유주형 선생님'],
      ['2', '09:00 - 12:00', '180분', '공동체 게임', '7개 코너 게임 및 조별 단합 활동', '권희운 선생님 외'],
      ['3', '10:00 - 11:30', '90분', '파송 예배', 'UCC 상영 및 수료 (강사: 양진우 전도사님)', '']
    ];
    sheet.getRange(1, 1, initialData.length, initialData[0].length).setValues(initialData);
  }
  
  const data = sheet.getDataRange().getValues();
  const result = { '1': [], '2': [], '3': [] };
  for (let i = 1; i < data.length; i++) {
    const day = String(data[i][0]);
    if (result[day]) {
      result[day].push({
        time: data[i][1],
        duration: data[i][2],
        program: data[i][3],
        details: data[i][4],
        bigo: data[i][5]
      });
    }
  }
  return JSON.stringify(result);
}

/**
 * [신규] 날짜별 열(Column) 단위 신청자 합계 동기화 함수
 * 명단 데이터에서 전체 인원수를 합산하여 RegistrationStatus 시트 세로 열에 기록
 */
/**
 * [신규] 반별/날짜별 상세 참석 현황 동기화 및 리포트 생성
 */
// syncDailyRegistrationStatus 는 RegistrationStatus 시트 삭제 결정에 따라 제거되었습니다. 

/**
 * [Utility] 시트에 전문가급 서식 적용 (Arial, 배경색, 테두리 등)
 */
function formatSheetProfessional(sheet, statusColIdx) {
  const range = sheet.getDataRange();
  const lastRow = range.getLastRow();
  const lastCol = range.getLastColumn();
  
  if (lastRow < 1 || lastCol < 1) return;

  // 1. 전체 기본 서식
  range.setFontFamily('Arial')
       .setFontSize(10)
       .setVerticalAlignment('middle')
       .setHorizontalAlignment('center');
       
  // 2. 헤더 서식 (1행)
  const header = sheet.getRange(1, 1, 1, lastCol);
  header.setBackground('#DEEBF7') // 연한 파랑
        .setFontWeight('bold')
        .setBorder(true, true, true, true, true, true, '#999999', SpreadsheetApp.BorderStyle.SOLID);
        
  // 3. 전체 테두리
  range.setBorder(true, true, true, true, true, true, '#CCCCCC', SpreadsheetApp.BorderStyle.SOLID);
  
  // 4. A열(반/이름) 배경 (볼드체 해제)
  sheet.getRange(1, 1, lastRow, 1).setFontWeight('normal').setBackground('#F8F9FA');

  // 5. 합계행 (있을 경우)
  for (let i = 1; i <= lastRow; i++) {
    const rowVal = sheet.getRange(i, 1).getValue();
    if (rowVal === '총합') {
      sheet.getRange(i, 1, 1, lastCol)
           .setBackground('#FFF2CC') // 연한 노랑
           .setFontWeight('bold');
    }
  }
  
  // 6. 조건부 서식 적용 (참가, 불참, 미정 색상 구분)
  // 기존 규칙 모두 제거 후 새로 설정
  sheet.clearConditionalFormatRules();
  
  const statusColRange = sheet.getRange(2, statusColIdx + 1, lastRow, 1);
  
  const rules = [];

  // 참가: 초록색
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('참가')
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setRanges([statusColRange])
    .build());

  // 불참: 빨간색
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('불참')
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setRanges([statusColRange])
    .build());

  // 미정: 회색
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('미정')
    .setBackground('#E2E3E5')
    .setFontColor('#383D41')
    .setRanges([statusColRange])
    .build());
  
  sheet.setConditionalFormatRules(rules);


  // 열 너비 자동 조정
  for (let j = 1; j <= lastCol; j++) {
    sheet.autoResizeColumn(j);
    const currWidth = sheet.getColumnWidth(j);
    sheet.setColumnWidth(j, currWidth + 20); // 약간의 여유
  }
}

function getColumnLetter(col) {
  let letter = "";
  while (col > 0) {
    let temp = (col - 1) % 26;
    letter = String.fromCharCode(65 + temp) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}
