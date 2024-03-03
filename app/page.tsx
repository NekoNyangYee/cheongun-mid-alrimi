import React from "react";
import EducationMealServiceDietInfo from "@/Components/EducationMealServiceDietInfo";
import EducationSchedules from "@/Components/EducationSchedules";
import EducationTimeTable from "@/Components/EducationTimeTable";
import { Header } from "@/Components/header/Header";
import StyledContent from "@/app/style";

const Home = () => {
  return (
    <>
      <Header />
      <StyledContent>
        <EducationSchedules />
        <EducationTimeTable />
        <EducationMealServiceDietInfo />
      </StyledContent>
    </>
  );
}

export default Home;
