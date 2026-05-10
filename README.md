# 📚 LibraryOS - 도서관 대출 관리 시스템

> Next.js 14 기반 도서관 대출 관리 웹 시스템  
> GitHub Actions를 활용한 AWS S3 자동 배포 (CI/CD)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazonaws)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?logo=githubactions)

---

## 📋 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [주요 기능](#-주요-기능)
3. [기술 스택](#-기술-스택)
4. [프로젝트 구조](#-프로젝트-구조)
5. [로컬 실행 방법](#-로컬-실행-방법)
6. [AWS S3 설정](#-aws-s3-설정)
7. [GitHub Actions CI/CD 설정](#-github-actions-cicd-설정)
8. [배포 흐름](#-배포-흐름)
9. [주의사항](#-주의사항)

---

## 🏫 프로젝트 소개

LibraryOS는 도서관 이용자와 사서 모두를 위한 웹 기반 도서 대출 관리 시스템입니다.

- **이용자**: 도서 검색, 카테고리 필터링, 대출 신청
- **사서**: 비밀번호 인증 후 도서 추가/삭제 및 전체 대출 현황 관리

백엔드 서버 없이 **React(Next.js) + 정적 호스팅** 구조로 동작하며,  
GitHub에 코드를 push하면 **GitHub Actions가 자동으로 빌드 후 AWS S3에 배포**합니다.

---

## 🚀 주요 기능

### 📖 도서 목록
- 전체 도서 카드 형태로 조회 (카테고리별 커버 이미지 포함)
- 제목 / 저자 실시간 검색
- 카테고리 버튼 필터링 (소설, 개발, 역사, 자기계발 등)
- 대출 가능 권수 표시 / 대출 불가 시 비활성화

### 📤 대출 신청
- 대출 신청 버튼 클릭 시 팝업 모달 표시
- 모달에서 대출자 이름 입력 후 신청
- 대출 완료 시 도서 가용 권수 자동 감소

### 📋 대출 현황
- 현재 대출중 / 반납 완료 목록 분리 표시
- 반납 기한(7일) 초과 시 연체 알림 표시 (주황색 강조)
- 반납 처리 시 확인 팝업 → 반납일, 연체 여부 확인 후 처리
- 헤더 및 탭에 연체 건수 배지 표시

### 🏆 인기 랭킹
- 전체 대출 기록 기준 누적 대출 횟수 TOP 10
- 🥇🥈🥉 메달 + 대출 횟수 비율 바 차트 시각화

### 📊 통계 대시보드
- 요약 카드: 전체 도서 수, 누적 대출, 현재 대출중, 반납 완료, 연체 건수, 대출 가능 권수
- 최근 7일 대출 추이 바 차트
- 카테고리별 대출 현황 수평 바 차트

### 🔒 도서 관리 (사서 전용)
- 비밀번호 입력 후 사서 모드 진입
- 도서 추가: 제목, 저자, 카테고리(셀렉트박스), 권수 입력
- 도서 삭제: 전체 목록에서 개별 삭제
- 잠금 버튼으로 사서 모드 종료

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router, Static Export) |
| Library | React 18 |
| Styling | CSS Modules |
| Hosting | AWS S3 정적 웹 호스팅 |
| CI/CD | GitHub Actions |
| Font | Google Fonts (Noto Sans KR, Space Mono) |
| Image | Unsplash (카테고리별 커버 이미지) |

---

## 📁 프로젝트 구조

```
library-nextjs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 자동 배포 설정
├── src/
│   ├── app/
│   │   ├── layout.js           # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── page.js             # 메인 페이지 진입점
│   │   └── globals.css         # 전역 CSS 변수 및 기본 스타일
│   ├── components/
│   │   ├── LibraryApp.jsx      # 전체 상태 관리 (대출/반납/도서 CRUD)
│   │   ├── Header.jsx          # 헤더 (통계 요약)
│   │   ├── Nav.jsx             # 탭 네비게이션
│   │   ├── BookList.jsx        # 도서 목록 + 검색 + 카테고리 필터
│   │   ├── LoanModal.jsx       # 대출 신청 팝업 모달
│   │   ├── LoanStatus.jsx      # 대출 현황 (대출중 / 반납완료)
│   │   ├── ReturnModal.jsx     # 반납 확인 팝업 모달
│   │   ├── Ranking.jsx         # 인기 도서 랭킹
│   │   ├── Dashboard.jsx       # 통계 대시보드
│   │   ├── BookManage.jsx      # 도서 관리 (사서 전용 + 잠금)
│   │   └── *.module.css        # 각 컴포넌트 CSS Module
│   └── data.js                 # 샘플 데이터 + 카테고리 + 커버 이미지 상수
├── next.config.js              # Next.js 설정 (Static Export, 경로 alias)
├── jsconfig.json               # 경로 alias 설정 (@/ → src/)
├── package.json                # 프로젝트 의존성 및 스크립트
└── .gitignore                  # Git 제외 파일 목록
```

---

## ⚙️ 로컬 실행 방법

### 사전 요구사항
- Node.js 20 이상
- npm

### 실행 순서

```bash
# 1. 저장소 클론
git clone https://github.com/본인아이디/library-nextjs.git
cd library-nextjs

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 빌드 테스트

```bash
# 프로덕션 빌드 (out/ 폴더 생성)
npm run build

# 빌드 결과 확인
ls out/
```

---

## 🪣 AWS S3 설정

### 1. S3 버킷 생성

1. AWS 콘솔 → S3 → **버킷 만들기**
2. 버킷 이름 입력 (예: `mybucket-20260101`) — 전 세계 고유해야 함
3. 리전: `us-east-1` (미국 동부)
4. **퍼블릭 액세스 차단 → 모두 해제** ✅
5. 나머지는 기본값 → 버킷 만들기

### 2. 정적 웹 호스팅 활성화

1. 버킷 선택 → **속성** 탭
2. 맨 아래 **정적 웹 사이트 호스팅** → 편집
3. 활성화 선택
4. 인덱스 문서: `index.html`
5. **오류 문서도 `index.html` 입력** (새로고침 404 방지)
6. 저장

### 3. 버킷 정책 설정 (퍼블릭 읽기 허용)

1. 버킷 → **권한** 탭 → **버킷 정책** → 편집
2. 아래 JSON 붙여넣기 (`내-버킷-이름` 부분 수정)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::내-버킷-이름/*"
    }
  ]
}
```

---

## 🤖 GitHub Actions CI/CD 설정

### 1. GitHub Secrets 등록

레포지토리 → `Settings` → `Secrets and variables` → `Actions` → **New repository secret**

| Secret 이름 | 값 | 위치 |
|------------|-----|------|
| `AWS_ACCESS_KEY_ID` | `aws_access_key_id` 값 | AWS Academy → AWS Details → AWS CLI |
| `AWS_SECRET_ACCESS_KEY` | `aws_secret_access_key` 값 | AWS Academy → AWS Details → AWS CLI |
| `AWS_SESSION_TOKEN` | `aws_session_token` 값 | AWS Academy → AWS Details → AWS CLI |
| `S3_BUCKET_NAME` | 버킷 이름 (예: `mybucket-20260101`) | S3 버킷 이름 |

> ⚠️ AWS Academy 세션은 **4시간마다 만료**됩니다.  
> 세션 만료 후 재배포하려면 Secrets 3개(`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)를 새 값으로 다시 등록해야 합니다.

### 2. deploy.yml 위치

```
.github/workflows/deploy.yml
```

### 3. deploy.yml 전체 내용

```yaml
name: Deploy Next.js to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build (Next.js static export)
        run: npm run build
        # 빌드 결과물은 ./out 폴더에 생성됩니다

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: aws s3 sync ./out s3://${{ secrets.S3_BUCKET_NAME }} --delete
        # CRA는 ./build, Next.js는 ./out 입니다
```

> ⚠️ CRA(Create React App)는 `./build`를 사용하지만,  
> **Next.js Static Export는 `./out`** 을 사용합니다. 혼동 주의!

---

## 🔄 배포 흐름

```
코드 수정
    ↓
git push origin main
    ↓
GitHub Actions 자동 실행
    ├── 1. 소스 코드 체크아웃
    ├── 2. Node.js 20 설치
    ├── 3. npm install (의존성 설치)
    ├── 4. npm run build → ./out 폴더 생성
    ├── 5. AWS 자격증명 설정
    └── 6. aws s3 sync ./out → S3 업로드
              ↓
    브라우저에서 S3 URL 접속
```

### 배포 URL 확인 방법

S3 → 버킷 → **속성** → **정적 웹 사이트 호스팅** → **버킷 웹 사이트 엔드포인트**

```
http://[버킷이름].s3-website-us-east-1.amazonaws.com
```

---

## ⚠️ 주의사항

### AWS Academy 세션 만료
AWS Academy 환경은 세션이 **4시간마다 초기화**됩니다.  
GitHub Actions 재실행 전 반드시 Secrets 3개를 최신 값으로 업데이트하세요.

### 새로고침 시 404 에러
S3 정적 호스팅 설정에서 **오류 문서를 반드시 `index.html`로 설정**하세요.  
설정하지 않으면 페이지 새로고침 시 404 에러가 발생합니다.

### CRA vs Next.js 빌드 폴더 차이

| 프레임워크 | 빌드 명령어 | 결과 폴더 | S3 sync 경로 |
|-----------|-----------|---------|-------------|
| CRA | `npm run build` | `./build` | `./build` |
| Next.js | `npm run build` | `./out` | `./out` |

### 사서 비밀번호 변경
기본 비밀번호는 `1234`입니다.  
`src/components/BookManage.jsx` 파일의 아래 값을 수정하세요.

```javascript
const LIBRARIAN_PASSWORD = '1234'; // 여기를 변경
```

---

## 📹 시연 영상

- **GitHub Actions CI/CD 구축 시연**: [YouTube 링크 추가 예정]
- **AWS Amplify 호스팅 시연**: [YouTube 링크 추가 예정]
