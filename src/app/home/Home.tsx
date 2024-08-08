'use client'
import React, { useState } from 'react'
// components
import HeroSection from './hero-section/HeroSection'
import AboutUs from './about-us/AboutUs'
import Programs from './programs/Programs'
import Gallery from './gallery/Gallery'
import ImageSection from './image-section/ImageSection'
import GreetingBlock from './greeting-block/GreetingBlock'
import Contact from './contact/Contact'
import Footer from './footer/Footer'
import Navbar from './navigation/Navbar'
import Sidebar from './sidebar/Sidebar'

const LandingPage = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  const showAside = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <>
      <div className="bg-brightGray relative">
        <Sidebar showAside={showAside} showSidebar={showSidebar} />
        <Navbar showAside={showAside} />
        <HeroSection />
        <section id="about-us">
          <AboutUs />
        </section>
        <section id="programs">
          <Programs />
        </section>
        <section id="gallery">
          <Gallery />
        </section>
        <ImageSection />
        <GreetingBlock />
        <section id="contact">
          <Contact />
        </section>
        <Footer />
      </div>
    </>
  )
}

export default LandingPage
