"use client"

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StyledHeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 70%;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    
    @media (max-width: 972px) {
      width: auto;
    }
`;

const HeaderBox = styled.div(({ isOpen }: { isOpen: boolean }) => `
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #FFFFFF;
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  z-index: 10;

  & .home-menu {
    display: inline-block;
    line-height: 0;
  }

  & .main-logo {
    width: 36px;
    height: 36px;

    @media (max-width: 972px) {
      margin: 0 auto;
    }
  }

  @media (max-width: 972px) {
    height: ${isOpen ? "100vh" : "auto"};
    overflow: hidden;
  }
`);

const StyledLink = styled.button<{ isActive: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ isActive }) => (isActive ? "#000000" : "#71717A")};
  border-bottom: ${({ isActive }) => (isActive ? "2px solid #000000" : "none")};
  font-size: 1rem;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  margin: 0;
  cursor: pointer;
`;

const MenuIcon = styled.div`
  position: absolute;
  display: none;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 15;
  line-height: 0;

  & svg {
    width: 30px;
    height: 30px;
    margin: auto 0;
  }

  @media (max-width: 972px) {
    display: block;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 972px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 972px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #FFFFFF;
    z-index: 5;
    gap: 20px;
  }
`;

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { href: "/info", label: "공지사항" },
    { href: "/schoolschedules", label: "학사일정" },
    { href: "/timetable", label: "시간표" },
    { href: "/mealinfo", label: "급식표" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // 컴포넌트가 언마운트될 때, 스크롤 방지 설정을 초기화하기 위한 cleanup 함수
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <HeaderBox isOpen={isOpen}>
      <StyledHeaderContent>
        <Link href="/" className="home-menu">
          <Image src="/logo/logo.webp" width={150} height={150} alt={""} className="main-logo" />
        </Link>
        <MenuIcon onClick={toggleMenu}>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
              <path d="M56 5.64L50.36 0L28 22.36L5.64 0L0 5.64L22.36 28L0 50.36L5.64 56L28 33.64L50.36 56L56 50.36L33.64 28L56 5.64Z" fill="black" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="38" viewBox="0 0 56 38" fill="none">
              <path d="M3.11111 37.3333C2.22963 37.3333 1.49126 37.0347 0.896 36.4373C0.298667 35.8421 0 35.1037 0 34.2222C0 33.3407 0.298667 32.6024 0.896 32.0071C1.49126 31.4098 2.22963 31.1111 3.11111 31.1111H52.8889C53.7704 31.1111 54.5087 31.4098 55.104 32.0071C55.7013 32.6024 56 33.3407 56 34.2222C56 35.1037 55.7013 35.8421 55.104 36.4373C54.5087 37.0347 53.7704 37.3333 52.8889 37.3333H3.11111ZM3.11111 21.7778C2.22963 21.7778 1.49126 21.4791 0.896 20.8818C0.298667 20.2865 0 19.5481 0 18.6667C0 17.7852 0.298667 17.0458 0.896 16.4484C1.49126 15.8532 2.22963 15.5556 3.11111 15.5556H52.8889C53.7704 15.5556 54.5087 15.8532 55.104 16.4484C55.7013 17.0458 56 17.7852 56 18.6667C56 19.5481 55.7013 20.2865 55.104 20.8818C54.5087 21.4791 53.7704 21.7778 52.8889 21.7778H3.11111ZM3.11111 6.22222C2.22963 6.22222 1.49126 5.92459 0.896 5.32933C0.298667 4.732 0 3.99259 0 3.11111C0 2.22963 0.298667 1.49022 0.896 0.892889C1.49126 0.29763 2.22963 0 3.11111 0H52.8889C53.7704 0 54.5087 0.29763 55.104 0.892889C55.7013 1.49022 56 2.22963 56 3.11111C56 3.99259 55.7013 4.732 55.104 5.32933C54.5087 5.92459 53.7704 6.22222 52.8889 6.22222H3.11111Z" fill="black" />
            </svg>
          )}
        </MenuIcon>
        <DesktopMenu>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <StyledLink isActive={pathname === link.href}>
                {link.label}
              </StyledLink>
            </Link>
          ))}
        </DesktopMenu>
        <MobileMenu isOpen={isOpen}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <StyledLink isActive={pathname === link.href} onClick={() => setIsOpen(!isOpen)}>
                {link.label}
              </StyledLink>
            </Link>
          ))}
        </MobileMenu>
      </StyledHeaderContent>
    </HeaderBox>
  );
};