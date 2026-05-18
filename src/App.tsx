import { useState } from "react";
import { SideProvider, detectSide } from "./sideContext";
import LoadingScreen from "./components/LoadingScreen";
import CursorEffect from "./components/CursorEffect";
import AudioPlayer from "./components/AudioPlayer";
import ThemeSwitcher from "./components/ThemeSwitcher";
import WishesOverlay from "./components/WishesOverlay";
import ScrollProgress from "./components/ScrollProgress";
import NavDots from "./components/NavDots";
import Hero from "./components/Hero";
import Introduction from "./components/Introduction";
import OurStory from "./components/OurStory";
import WeddingDetails from "./components/WeddingDetails";
import Location from "./components/Location";
import Gallery from "./components/Gallery";
import RSVP from "./components/RSVP";
import WeddingGift from "./components/WeddingGift";
import Footer from "./components/Footer";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [loaded, setLoaded] = useState(false);
  const side = detectSide();

  return (
    <SideProvider side={side}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <CursorEffect />
      {loaded && (
        <>
          <AudioPlayer />
          <ThemeSwitcher />
          <WishesOverlay />
          <ScrollProgress />
          <NavDots />
          <main>
            <Hero />
            <Introduction />
            <OurStory />
            <WeddingDetails />
            <Location />
            <Gallery />
            <RSVP />
            <WeddingGift />
            <Footer />
          </main>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </SideProvider>
  );
}

export default App;
