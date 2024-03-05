"use client"

import styled from "@emotion/styled"

const StyledContent = styled.main`
  margin: 0 auto;
  max-width: 70%;
  width: 100%;
  padding-top: 90px;

  & a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

export default StyledContent;
