# 📚 LibraryOS

> **library-system** | React(CRA) 기반 도서관 대출 관리 웹 시스템
> GitHub Actions를 활용한 AWS S3 자동 배포 (CI/CD)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazonaws)
![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-FF9900?logo=awsamplify)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?logo=githubactions)

---

## 🏫 프로젝트 소개

**LibraryOS**는 도서관 이용자와 사서를 위한 웹 기반 도서 대출 관리 시스템입니다.

이용자는 도서를 검색하고 대출 신청을 할 수 있으며, 사서는 비밀번호 인증 후 도서 추가/삭제 및 대출 현황을 관리할 수 있습니다.

백엔드 서버 없이 **React + 샘플 데이터** 기반으로 동작하며, GitHub에 코드를 push하면 **GitHub Actions가 자동으로 빌드 후 AWS S3에 배포**됩니다.

> 🤖 이 프로젝트는 **Claude (Anthropic)** 생성형 AI의 도움을 받아 구현되었습니다.

---

## 🌐 배포 URL

| 서비스      | URL                                                         |
| ----------- | ----------------------------------------------------------- |
| AWS S3      | http://mybucket-20263564.s3-website-us-east-1.amazonaws.com |
| AWS Amplify | https://main.dsnietznhyo4d.amplifyapp.com                   |

> ⚠️ S3 URL은 AWS Academy 세션 기준 4시간만 유효합니다.

---

## 🎬 시연 영상

| 과제                           | 영상                         |
| ------------------------------ | ---------------------------- |
| GitHub Actions CI/CD 구축 시연 | https://youtu.be/ZrYCbC9toYs |
| AWS Amplify 호스팅 시연        | https://youtu.be/VwDdX62TfEU |

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
- 반납 기한(7일) 초과 시 연체 알림 (주황색 강조)
- 반납 처리 시 확인 팝업 → 반납일, 연체 여부 확인 후 처리
- 헤더 및 탭에 연체 건수 배지 표시

### 🏆 인기 랭킹

- 전체 대출 기록 기준 누적 대출 횟수 TOP 10
- 🥇🥈🥉 메달 + 비율 바 차트 시각화

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

| 구분      | 기술                                    |
| --------- | --------------------------------------- |
| Framework | React 18 (CRA)                          |
| Styling   | CSS (단일 App.css)                      |
| Hosting   | AWS S3 정적 웹 호스팅 / AWS Amplify     |
| CI/CD     | GitHub Actions                          |
| Font      | Google Fonts (Noto Sans KR, Space Mono) |
| Image     | Unsplash (카테고리별 커버 이미지)       |
| AI        | Claude (Anthropic)                      |

---

## 📁 프로젝트 구조

```
library-system/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 자동 배포 설정
├── public/
│   └── index.html          # React가 마운트될 HTML 껍데기
├── src/
│   ├── App.js              # 메인 앱 컴포넌트 (전체 상태 관리 + UI)
│   ├── App.css             # 전체 스타일
│   ├── index.js            # React 진입점
│   └── data.js             # 샘플 데이터, 카테고리, 커버 이미지 상수
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ 로컬 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/yuna0222/library-system.git
cd library-system

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm start
# 브라우저에서 http://localhost:3000 자동으로 열림
```

---

## 🤖 GitHub Actions CI/CD 설정

### GitHub Secrets 등록

레포지토리 → `Settings` → `Secrets and variables` → `Actions` → **New repository secret**

| Secret 이름             | 설명                      |
| ----------------------- | ------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS Academy Access Key    |
| `AWS_SECRET_ACCESS_KEY` | AWS Academy Secret Key    |
| `AWS_SESSION_TOKEN`     | AWS Academy Session Token |
| `S3_BUCKET_NAME`        | 배포할 S3 버킷 이름       |

> ⚠️ AWS Academy 세션은 4시간마다 만료됩니다. 재배포 시 Secrets 3개를 새 값으로 업데이트하세요.

### 배포 흐름

```
git push origin main
        ↓
GitHub Actions 자동 실행
        ├── 1. 소스 코드 체크아웃
        ├── 2. Node.js 20 설치
        ├── 3. npm install
        ├── 4. npm run build → ./build 폴더 생성
        ├── 5. AWS 자격증명 설정
        └── 6. aws s3 sync ./build → S3 업로드
```

### deploy.yml

```yaml
name: Deploy React to S3 (Academy)

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: aws s3 sync ./build s3://${{ secrets.S3_BUCKET_NAME }} --delete
```

---

## ☁️ AWS Amplify 호스팅

과제1의 GitHub 레포지토리를 AWS Amplify에 연결하여 자동 배포합니다.
`git push` 시 Amplify가 자동으로 빌드 → 배포까지 처리합니다.

### amplify.yml

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

### GitHub Actions vs Amplify 비교

| 구분        | GitHub Actions           | AWS Amplify            |
| ----------- | ------------------------ | ---------------------- |
| 배포 대상   | 내 S3 버킷               | Amplify 전용 서버      |
| 설정 난이도 | yaml 직접 작성           | GitHub 연결만으로 자동 |
| 세션 만료   | 4시간마다 Secrets 재등록 | 없음                   |
| 배포 URL    | s3-website URL           | amplifyapp.com         |

---

## ⚠️ 주의사항

**AWS Academy 세션 만료**
S3 배포 시 세션이 4시간마다 만료됩니다.
재배포 전 Secrets 3개를 새 값으로 업데이트하세요.

**사서 비밀번호 변경**
`src/App.js`의 아래 값을 수정하세요.
```javascript
const LIBRARIAN_PASSWORD = "1234";
```
