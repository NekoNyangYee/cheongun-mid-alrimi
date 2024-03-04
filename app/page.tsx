import React from "react";
import EducationMealServiceDietInfo from "@/Components/EducationMealServiceDietInfo";
import EducationSchedules from "@/Components/EducationSchedules";
import EducationTimeTable from "@/Components/EducationTimeTable";

const Home = () => {
  return (
    <>
      <EducationSchedules />
      <EducationTimeTable />
      <EducationMealServiceDietInfo />
    </>
  );
}

export default Home;
