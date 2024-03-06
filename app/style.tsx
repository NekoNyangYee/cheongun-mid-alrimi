"use client"

import styled from "@emotion/styled"

export const StyledContent = styled.main`
  margin: 0 auto;
  max-width: 70%;
  width: 100%;
  padding-top: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 32px;

  & a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    flex-direction: column;
    gap: 16px;
  }

  @media (max-width: 972px) {
    max-width: 90%;
    flex-direction: column-reverse; // 세로로 역순 배치
    gap: 16px;
  }
`;

