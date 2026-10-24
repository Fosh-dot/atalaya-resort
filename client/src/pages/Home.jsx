import HeroSection from "../components/home/HeroSection";
import OurStorySection from "../components/home/OurStorySection";
import ExperiencesSection from "../components/home/ExperiencesSection";
import VillasSection from "../components/home/VillasSection";
import RoomDetailsSection from "../components/home/RoomDetailsSection";
import ResortStorySection from "../components/home/ResortStorySection";
import ResortFacilitiesSection from "../components/home/ResortFacilitiesSection";
import PicturesqueMoments from "../components/home/PicturesqueMoments";

import "./Home.css";
import GoogleReviewsSection from "../components/home/GoogleReviewsSection";
import EscapeSection from "../components/home/EscapeSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <OurStorySection />
      <ExperiencesSection />
      <VillasSection />
      <RoomDetailsSection />
      <ResortStorySection />
      <ResortFacilitiesSection />
      <PicturesqueMoments />
      <GoogleReviewsSection />
      <EscapeSection />
      <Footer />
    </div>
  );
}

export default Home;
