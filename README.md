# 11월의 사랑 운세

졸업작품 〈When Love Responds, 사랑의 응답〉 홍보용 인터랙티브 웹사이트입니다.
메인 → 카드 뽑기 → 운세 결과(6종) → 초대장 → 다시 뽑기 / 공유하기.

- React 18 + Vite 5, 정적 사이트 (서버·DB 없음)
- 폰트: Pretendard (npm 패키지로 내장, 필요한 글자만 내려받는 dynamic subset)
- 애니메이션: 브라우저 내장 Web Animations API (외부 라이브러리 없음)
- 카드·아이콘·배경은 모두 CSS/SVG — 이미지 파일을 쓰지 않아 고해상도 화면에서도 선명합니다.

## 로컬에서 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 에 배포용 파일 생성
npm run preview    # 빌드 결과 확인
```

Node.js 18 이상이 필요합니다.

## 폴더 구조

```
src/
  data/loves.js            ← 여섯 가지 운세 문구·키워드, 초대장 정보, 공유 문구 (문구 수정은 여기만)
  components/
    MainScreen.jsx         ← 메인 화면 (카드 궤도 좌표 RING 포함)
    ResultScreen.jsx       ← 결과 화면 공통 컴포넌트 (6종 모두 이 하나로 표시)
    InviteScreen.jsx       ← 초대장 화면
    Card.jsx               ← 카드 뒷면 / 앞면
    Icons.jsx              ← SVG 아이콘, [괄호] 강조
  lib/
    drawSequence.js        ← 카드 뽑기 애니메이션 (모이기 → 뒤집기 → 결과 자리로 이동)
    share.js               ← 공유하기 (Web Share API → 미지원 시 링크 복사)
    motion.js              ← 애니메이션 보조 함수, 움직임 줄이기 감지
  styles/
    base.css               ← 색상·버튼 등 공통 디자인 토큰
    card.css / main.css / result.css / invite.css
```

## 자주 바꿀 만한 것

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 운세 제목·본문·키워드 | `src/data/loves.js` → `LOVES` |
| 전시 날짜·장소·작품 정보 | `src/data/loves.js` → `INVITE` |
| 공유 제목·문구 | `src/data/loves.js` → `SHARE` |
| 색상 | `src/styles/base.css` → `:root` |
| 애니메이션 속도 | `src/lib/drawSequence.js` 의 `duration` 값 |

## 반응형

- 899px 이하: 확정된 모바일 시안(390×844) 그대로. 360–430px 폭, 낮은 화면 높이에서도 버튼이 화면 안에 오도록 카드 크기만 단계적으로 조정합니다.
- 560–899px(태블릿): 모바일 구성을 520px 폭으로 가운데 배치.
- 900px 이상(PC): 메인은 타이틀(좌) + 카드 궤도(우), 결과는 카드(좌) + 운세(우), 초대장은 날짜(좌) / 장소·작품(우) 2열.

## GitHub + Vercel 배포

1. GitHub에서 새 저장소를 만들고 이 폴더를 올립니다.
   ```bash
   git init
   git add .
   git commit -m "11월의 사랑 운세"
   git branch -M main
   git remote add origin https://github.com/<아이디>/<저장소이름>.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New… → Project** → 방금 만든 저장소 **Import**.
3. Framework Preset이 **Vite**로 자동 선택됩니다 (Build Command `npm run build`, Output Directory `dist`). 그대로 **Deploy**.
4. 이후 `main` 브랜치에 push 할 때마다 자동으로 다시 배포됩니다.

공유하기 버튼은 현재 접속한 주소를 그대로 공유하므로, 배포 주소가 바뀌어도 따로 수정할 필요가 없습니다.

## 접근성·동작 메모

- 기기 설정에서 '동작 줄이기'를 켜면 카드 애니메이션 대신 부드러운 페이드로 전환됩니다.
- 애니메이션 중에는 버튼이 중복 실행되지 않습니다.
- 브라우저 뒤로가기로 이전 화면에 돌아갈 수 있습니다.
- 각 유형이 뽑힐 확률은 1/6로 동일합니다 (`crypto.getRandomValues`, 편향 없음).
