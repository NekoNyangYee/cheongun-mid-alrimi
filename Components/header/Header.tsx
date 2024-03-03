"use client"

import React, { useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";

// GlobalStyle은 페이지 전체에 스타일을 적용할 때 사용합니다.
// 여기서는 메뉴가 열렸을 때의 스크롤 방지를 위해 사용됩니다만, 
// 문제 해결을 위해 제거하고 다른 방법을 모색합니다.

const HeaderBox = styled.div(({ isOpen }: { isOpen: boolean }) => `
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  transition: height 0.3s ease-in-out;

  & .main-logo {
    width: 50px;
    height: 50px;
    @media (max-width: 768px) {
        margin: 0 auto;
      }
  }

  @media (max-width: 768px) {
    height: ${isOpen ? "100vh" : "auto"};
    overflow: hidden;
  }
`);

const MenuIcon = styled.div`
  position: absolute;
  display: none;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 15;

  & svg {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;

// 모바일용 메뉴
const MobileMenu = styled.div(({ isOpen }: { isOpen: boolean }) => `
  display: none;
  @media (max-width: 768px) {
    display: ${isOpen ? "flex" : "none"};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f8f9fa;
    z-index: 5;
  }
`);

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <HeaderBox isOpen={isOpen}>
            <Image src="/logo/logo.webp" width={150} height={150} alt={""} className="main-logo"></Image>

            <MenuIcon onClick={toggleMenu}>
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <path d="M56 5.64L50.36 0L28 22.36L5.64 0L0 5.64L22.36 28L0 50.36L5.64 56L28 33.64L50.36 56L56 50.36L33.64 28L56 5.64Z" fill="black" />
                    </svg>
                ) : (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <rect width="96" height="96" fill="url(#pattern0)" />
                        <defs>
                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlinkHref="#image0_102_3" transform="scale(0.0104167)" />
                            </pattern>
                            <image id="image0_102_3" width="96" height="96" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAApElEQVR4nO3ZwRGAQAgDwPTfdCzCRwbdnaEACXAPEwAAAAAAAAD+rCpveiCAbIdIABHAr8/Ya+sP6PESQAQwn8LagH0jevUEAQAAAAAA37f+odHjJYAIYD6FtQH7RtQJ2jejg/IGRADzKawN2DeiV08QAAAAAADwfesfGj1eAogA5lNYG7BvRJ2gfTM6KG9ABDCfwtqAfSN69QQBAAAAAAAAkJMejjF46oBK0jUAAAAASUVORK5CYII=" />
                        </defs>
                    </svg>

                )}
            </MenuIcon>
            <DesktopMenu>
                <a href="#">홈</a>
                <a href="#">학사일정</a>
                <a href="#">시간표</a>
                <a href="#">급식표</a>
            </DesktopMenu>
            <MobileMenu isOpen={isOpen}>
                <a href="#">홈</a>
                <a href="#">학사일정</a>
                <a href="#">시간표</a>
                <a href="#">급식표</a>
            </MobileMenu>
        </HeaderBox>
    );
};