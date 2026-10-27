// 여섯 가지 사랑 — 운세 콘텐츠
// 문구를 바꾸려면 이 파일만 수정하면 됩니다.
// titleEmphasis: 제목 첫 줄에서 [대괄호]로 강조되는 부분
// titleRest:     강조 뒤에 붙는 조사 (첫 줄 끝)
// titleLine2:    제목 둘째 줄

export const LOVES = [
  {
    id: 'eros',
    no: '01',
    en: 'EROS',
    ko: '에로스',
    trait: '열정적이고 강렬한 사랑',
    titleEmphasis: '열정적인 사랑',
    titleRest: '을',
    titleLine2: '할 당신!',
    body:
      '이번 11월에는 마음을 강하게 끌어당기는 감정이 찾아올 수 있어요. 숨기기보다 솔직하게 표현할수록 관계가 더 선명해질 거예요. 당신의 진심은 생각보다 더 큰 울림을 만들어냅니다.',
    keywords: ['열정', '고백', '강한 끌림'],
  },
  {
    id: 'ludus',
    no: '02',
    en: 'LUDUS',
    ko: '루두스',
    trait: '장난스럽고 유쾌한 사랑',
    titleEmphasis: '장난스러운 설렘',
    titleRest: '이',
    titleLine2: '필요한 당신!',
    body:
      '이번 11월에는 예상치 못한 순간에 설렘이 찾아올지도 몰라요. 가벼운 농담과 사소한 장난이 누군가와의 거리를 좁혀줄 거예요. 너무 진지하게 고민하기보다 지금의 두근거림을 즐겨보세요.',
    keywords: ['설렘', '장난', '두근거림'],
  },
  {
    id: 'philia',
    no: '03',
    en: 'PHILIA',
    ko: '필리아',
    trait: '우정과 신뢰를 바탕으로 한 사랑',
    titleEmphasis: '다정한 우정',
    titleRest: '이',
    titleLine2: '빛나는 당신!',
    body:
      '이번 11월에는 가까운 사람들과의 관계에서 특별한 행복을 느낄 수 있어요. 서로를 이해하고 응원하는 마음이 생각보다 큰 힘이 되어줄 거예요. 익숙한 친구의 다정함 속에서 새로운 사랑의 모습을 발견할지도 몰라요.',
    keywords: ['우정', '신뢰', '다정함'],
  },
  {
    id: 'storge',
    no: '04',
    en: 'STORGE',
    ko: '스토르게',
    trait: '가족적이고 익숙한 사랑',
    titleEmphasis: '익숙한 사랑',
    titleRest: '이',
    titleLine2: '더욱 소중해질 당신!',
    body:
      '이번 11월에는 늘 곁에 있던 사람들의 소중함을 새삼 느끼게 될지도 몰라요. 당연하게 여겼던 작은 배려가 마음을 따뜻하게 만들어줄 거예요. 가까운 사람에게 평소 전하지 못했던 고마움을 표현해 보세요.',
    keywords: ['가족', '온기', '고마움'],
  },
  {
    id: 'pragma',
    no: '05',
    en: 'PRAGMA',
    ko: '프라그마',
    trait: '오래 지속되는 성숙한 사랑',
    titleEmphasis: '단단한 사랑',
    titleRest: '을',
    titleLine2: '만들어갈 당신!',
    body:
      '이번 11월에는 서로의 차이를 이해하는 마음이 더욱 중요해질 거예요. 모든 것이 완벽하게 맞지 않아도 괜찮아요. 서두르지 않고 서로의 속도를 맞춰간다면 관계는 이전보다 더욱 단단해질 수 있어요.',
    keywords: ['이해', '균형', '믿음'],
  },
  {
    id: 'agape',
    no: '06',
    en: 'AGAPE',
    ko: '아가페',
    trait: '대가를 바라지 않는 무조건적인 사랑',
    titleEmphasis: '따뜻한 사랑',
    titleRest: '을',
    titleLine2: '전할 당신!',
    body:
      '이번 11월에는 당신의 작은 친절이 누군가에게 큰 위로가 될지도 몰라요. 대가를 바라지 않고 건넨 마음이 생각보다 멀리 전해질 거예요. 마음이 움직이는 순간, 그 따뜻함을 아낌없이 나눠보세요.',
    keywords: ['배려', '나눔', '따뜻함'],
  },
];

// 여섯 가지가 모두 같은 확률로 뽑힙니다.
export function drawLove() {
  let i;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // 편향 없는 0–5 정수
    const buf = new Uint8Array(1);
    do {
      crypto.getRandomValues(buf);
    } while (buf[0] >= 252); // 252 = 6 * 42
    i = buf[0] % 6;
  } else {
    i = Math.floor(Math.random() * 6);
  }
  return LOVES[i];
}

export const INVITE = {
  eyebrow: 'YOU’RE INVITED',
  titleEmphasis: '당신의 사랑',
  titleRest: '이',
  titleLine2: '기다리는 곳',
  subLine1: '당신이 뽑은 사랑을',
  subLine2: '11월의 끝, 졸업전시에서 만나보세요.',
  year: '2026',
  dates: [
    { date: '11.26', day: '목', time: '18:00–20:00' },
    { date: '11.27', day: '금', time: '10:30–20:00' },
    { date: '11.28', day: '토', time: '10:30–20:00' },
    { date: '11.29', day: '일', time: '10:30–17:00' },
  ],
  place: '1289 벙커',
  address: '서울특별시 용산구 이태원동 128-9',
  workLabel: '이곳에서 만날 수 있는 작품',
  workEn: 'When Love Responds',
  workKo: '사랑의 응답',
  workMeta: 'Interactive Media Art · 박채림',
  footer1: '수원대학교 디지털콘텐츠전공 2026 졸업전시회',
  footer2: '본 페이지는 개인 작품 홍보를 위해 제작되었습니다.',
};

export const SHARE = {
  title: '11월의 사랑 운세',
  text: '당신의 11월, 어떤 사랑이 응답할까요?',
};
