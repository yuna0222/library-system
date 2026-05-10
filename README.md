# 📚 LibraryOS - 도서관 대출 관리 시스템

React + Firebase Firestore로 구현한 도서관 대출 관리 웹 시스템입니다.  
GitHub Actions를 통해 AWS S3에 자동 배포됩니다.

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 📖 도서 목록 조회 | 전체 도서 목록 및 대출 가능 여부 확인 |
| 🔍 도서 검색 | 제목 또는 저자로 실시간 검색 |
| 📤 대출 신청 | 대출자 이름 입력 후 도서 대출 |
| 📥 반납 처리 | 대출 현황에서 반납 처리 |
| 📊 대출 현황 | 현재 대출중 / 반납완료 목록 확인 |
| ➕ 도서 추가/삭제 | 관리자 기능으로 도서 등록 및 삭제 |

---

## 🛠 기술 스택

- **Frontend**: React 18
- **Database**: Firebase Firestore (Cloud DB)
- **Hosting**: AWS S3 정적 웹 호스팅
- **CI/CD**: GitHub Actions

---

## ⚙️ 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 실행
npm start
```

---

## 🔥 Firebase 설정

1. [Firebase 콘솔](https://console.firebase.google.com)에서 새 프로젝트 생성
2. Firestore Database 생성 (테스트 모드)
3. 프로젝트 설정 > 웹 앱 추가 > SDK 구성 복사
4. `src/firebase.js`에 값 붙여넣기

### Firestore 컬렉션 구조

**`books` 컬렉션**
```
{
  title: "도서 제목",
  author: "저자",
  category: "카테고리",
  total: 3,       // 총 권수
  available: 2    // 대출 가능 권수
}
```

**`loans` 컬렉션**
```
{
  bookId: "도서 문서 ID",
  bookTitle: "도서 제목",
  author: "저자",
  borrower: "대출자 이름",
  loanDate: "2026-05-10",
  returnDate: null,
  status: "대출중" | "반납완료"
}
```

---

## 🤖 GitHub Actions CI/CD 설정

### GitHub Secrets 등록
`Settings > Secrets and variables > Actions`에서 등록:

| Secret 이름 | 설명 |
|------------|------|
| `AWS_ACCESS_KEY_ID` | AWS Academy Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Academy Secret Key |
| `AWS_SESSION_TOKEN` | AWS Academy Session Token (세션 만료 시 재등록) |
| `S3_BUCKET_NAME` | 배포할 S3 버킷 이름 |

### 배포 흐름
```
main 브랜치 push
  → Node.js 설치
  → npm install
  → npm run build
  → AWS S3 sync (자동 배포)
```

---

## 🌐 배포 URL

> AWS S3 세션은 4시간 유효합니다.

`http://[버킷이름].s3-website-us-east-1.amazonaws.com`

---

## 📹 시연 영상

- **GitHub Actions CI/CD 구축**: [YouTube 링크]
- **AWS Amplify 호스팅**: [YouTube 링크]
