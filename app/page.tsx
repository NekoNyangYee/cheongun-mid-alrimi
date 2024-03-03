import EducationMealServiceDietInfo from "@/Components/EducationMealServiceDietInfo";
import EducationSchedules from "@/Components/EducationSchedules";
import EducationTimeTable from "@/Components/EducationTimeTable";
import { Header } from "@/Components/header/Header";

const Home = () => {
  return (
    <>
      <Header />
      <EducationSchedules />
      <EducationTimeTable />
      <EducationMealServiceDietInfo />
    </>
  );
}

export default Home;