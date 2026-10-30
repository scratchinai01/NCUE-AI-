import { ScenarioPreset } from '../types';

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: 'math-pythagoras',
    title: '📐 國中數學 · 畢氏定理探究',
    stage: '國中',
    subject: '國中數學',
    topic: '畢氏定理的幾何驗證與生活應用測量',
    pedagogies: ['PBL探究', '合作學習', '情境教學'],
    assessments: ['學習單', '實作表現', '同儕互評'],
    extra: '班上有 3 位同學乘除代數運算速度較慢，需要具備圖形面積拼貼的視覺鷹架支持。',
  },
  {
    id: 'sci-water-cycle',
    title: '🌿 國小自然 · 水的三態與氣象循環',
    stage: '國小',
    subject: '國小自然科學',
    topic: '水的三態變化、雲雨露霜成因與生活水循環',
    pedagogies: ['遊戲化學習', '情境教學', '講述引導'],
    assessments: ['學習單', '實作表現'],
    extra: '學生動手操作好奇心強但容易分心吵鬧，需要清晰的小組實驗常規與安全操作引導。',
  },
  {
    id: 'eng-sdgs-climate',
    title: '🌍 高中英文 · SDGs 氣候倡議演說',
    stage: '高中',
    subject: '高中英語文',
    topic: 'SDGs 13 氣候行動：青年倡議與論證演說寫作',
    pedagogies: ['翻轉教室', '合作學習', 'PBL探究'],
    assessments: ['口頭報告', '同儕互評', '檔案評量'],
    extra: '全班英語口說流暢度呈雙峰分佈，需提供不同難度的論證句型鷹架 (Sentence Starters)。',
  },
  {
    id: 'soc-ocean-trade',
    title: '🗺️ 國中社會 · 大航海時代臺灣',
    stage: '國中',
    subject: '國中社會 (歷史)',
    topic: '17世紀大航海時代的臺灣：原住民、荷蘭、西班牙與漢人的互動',
    pedagogies: ['情境教學', '講述引導', 'PBL探究'],
    assessments: ['學習單', '口頭報告'],
    extra: '需融入多元文化觀點與歷史同理心，引導學生從不同族群視角重新審視歷史事件。',
  },
  {
    id: 'sped-emotion-social',
    title: '🧩 特教融合 · 情緒調節與社交溝通',
    stage: '特殊教育',
    subject: '特殊需求領域 (社交技巧/生活管理)',
    topic: '校園衝突情境中的自我情緒察覺與停看聽解決模式',
    pedagogies: ['情境教學', '合作學習'],
    assessments: ['實作表現', '同儕互評'],
    extra: '包含 2 位注意力缺陷過動 (ADHD) 學生及 1 位自閉症光譜 (ASD) 同學，需圖像化視覺時間表。',
  },
];

export const pedagogyOptions = [
  '講述引導',
  'PBL探究',
  '合作學習',
  '翻轉教室',
  '遊戲化學習',
  '情境教學',
  '提問思考',
  '差異化分組',
  '概念構圖',
  '實驗操作',
];

export const assessmentOptions = [
  '紙筆測驗',
  '學習單',
  '口頭報告',
  '實作表現',
  '同儕互評',
  '檔案評量',
  '表現任務',
  '闖關測驗',
  '學習歷程反思',
];

export const stageOptions = [
  '國小',
  '國中',
  '高中',
  '特殊教育',
  '幼兒園',
  '大專院校',
];

export const commonSubjects = [
  '國語文',
  '英語文',
  '數學',
  '自然科學',
  '社會領域',
  '資訊科技',
  '健康與體育',
  '藝術領域',
  '綜合活動',
  '特教專題',
];
