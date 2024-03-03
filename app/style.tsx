"use client"

// style.tsx
import styled from "@emotion/styled"

const StyledContent = styled.main`
  margin: 0 auto;
  max-width: 70%;
  width: 100%;
  padding-top: 70px; // Header의 고정 높이를 고려한 상단 패딩

  @media (max-width: 1224px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

export default StyledContent;
