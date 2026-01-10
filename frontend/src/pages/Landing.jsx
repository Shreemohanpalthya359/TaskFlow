import Navbar from "../components/common/Navbar"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import HowItWorks from "../components/landing/HowItWorks"
import CTA from "../components/landing/CTA"
import Footer from "../components/common/Footer"

export default function Landing() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-brandStart via-brandMid to-brandEnd">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
    </>
  )
}
