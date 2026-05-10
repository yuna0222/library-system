import './globals.css';

export const metadata = {
  title: 'LibraryOS - 도서관 대출 관리 시스템',
  description: 'Next.js + Firebase 기반 도서관 대출 관리 시스템',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
