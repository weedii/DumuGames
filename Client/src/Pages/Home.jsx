import Header from "../Components/Header";
import About from "../Components/About";
import ExploreCatalog from "../Components/ExploreCatalog";
import SaveMoneySection from "../Components/SaveMoneySection";

const Home = () => {
  return (
    <div>
      <Header />
      <ExploreCatalog />
      <About />
      <SaveMoneySection />
    </div>
  );
};

export default Home;
