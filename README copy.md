# 📚 LibraryOS - 도서관 대출 관리 시스템

Next.js 14 기반 도서관 대출 관리 웹 시스템입니다.  
GitHub Actions를 통해 AWS S3에 자동 배포됩니다.

## 🚀 주요 기능

| 탭 | 기능 |
|----|------|
| 도서 목록 | 도서 조회, 제목/저자 검색, 카테고리 필터, 대출 신청 |
| 대출 현황 | 대출중/반납완료 목록, 연체 알림, 반납 처리 |
| 인기 랭킹 | 누적 대출 횟수 기준 TOP 10 |
| 통계 | 요약 카드, 최근 7일 추이, 카테고리별 대출 차트 |
| 도서 관리 | 도서 추가 / 삭제 |

## 🛠 기술 스택

- **Framework**: Next.js 14 (Static Export)
- **Styling**: CSS Modules
- **Hosting**: AWS S3 정적 웹 호스팅
- **CI/CD**: GitHub Actions

## ⚙️ 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

## 🤖 GitHub Actions CI/CD 설정

`Settings > Secrets and variables > Actions`에서 등록:

| Secret | 설명 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | AWS Academy Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Academy Secret Key |
| `AWS_SESSION_TOKEN` | AWS Academy Session Token |
| `S3_BUCKET_NAME` | S3 버킷 이름 |

main 브랜치에 push하면 자동 빌드 → S3 배포됩니다.

## 🌐 배포 URL

`http://[버킷이름].s3-website-us-east-1.amazonaws.com`

> AWS Academy 세션은 4시간마다 만료됩니다. 만료 시 Secrets 3개를 재등록하세요.
