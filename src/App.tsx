import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import CursorEffect from './components/CursorEffect'
import AudioPlayer from './components/AudioPlayer'
import ScrollProgress from './components/ScrollProgress'
import NavDots from './components/NavDots'
import Hero from './components/Hero'
import OurStory from './components/OurStory'
import WeddingDetails from './components/WeddingDetails'
import HumorSection from './components/HumorSection'
import Gallery from './components/Gallery'
import RSVP from './components/RSVP'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      <CursorEffect />
      {loaded && (
        <>
          <AudioPlayer />
          <ScrollProgress />
          <NavDots />
          <Hero />
          <OurStory />
          <WeddingDetails />
          <HumorSection />
          <Gallery />
          <RSVP />
          <Footer />
        </>
      )}
    </>
  )
}

export default App
