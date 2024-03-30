"use client"

import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";

const StyledFooter = styled.footer`
    margin-top: auto;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background-color: #F4F4F5;
    padding: 1.5rem 0;
    text-align: center;
    box-sizing: border-box;

    & p {
        margin: 0;
        color: #71717A;
    }

    & .footer-title {
        font-size: 1.5rem;
        margin: 0;
        color: #71717A;
    }

    & .social-links {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;

        & svg {
            cursor: pointer;
        }
    }
`;

const FooterBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: left;
    max-width: 70%;
    margin: 0 auto;

    @media (max-width: 1224px) {
        max-width: 90%;
    }
`;

export const Footer = () => {
    return (
        <StyledFooter>
            <FooterBox>
                <h2 className="footer-title">청운중학교 통합 알리미</h2>
                <div className="social-links">
                    <a href="https://www.instagram.com/_nekokim_/">
                        <Image src="/social-img/instagram.svg" width={24} height={24} alt={""} />
                    </a>
                    <a href="https://github.com/NekoNyangYee">
                        <Image src="/social-img/github.svg" width={24} height={24} alt={""} />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=100010060443473&locale=ko_KR">
                        <Image src="/social-img/facebook.svg" width={24} height={24} alt={""} />
                    </a>
                </div>
                <p>[28527] 충청북도 청주시 상당구 상당로69번길 38</p>
                <p>© 2024 청운중학교 통합 알리미 All rights reserved.</p>
            </FooterBox>
        </StyledFooter>
    );
}