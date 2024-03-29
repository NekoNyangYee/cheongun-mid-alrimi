import { Header } from "@/Components/header/Header";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Mainbody, StyledContent } from "./style";
import { Footer } from "@/Components/footer/Footer";

const noto_sans_kr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: "청운중학교 통합 알리미",
  description: "학교의 시간표, 급식 정보, 학사 일정을 한 곳에서.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ height: "100%" }}>
      <link rel="manifest" href="/manifest.json" />
      <Mainbody className={noto_sans_kr.className}>
        <StyledContent>
          <Header />
          {children}
        </StyledContent>
        <Footer />
      </Mainbody>
    </html>
  );
}
