import ContactSection from "./landingPageComponents/ContactSection";
import Footer from "./landingPageComponents/Footer";
import Header from "./landingPageComponents/Header";
import HeroSection from "./landingPageComponents/HeroSection";
import ServicesSection from "./landingPageComponents/ServicesSection";


const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </>
  );
}

export default Home;