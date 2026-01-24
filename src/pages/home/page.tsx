
import Hero from './components/Hero';
import About from './components/About';
import Specialties from './components/Specialties';
import Gallery from './components/Gallery';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#410704]">
      <Hero />
      <About />
      <Specialties />
      <Gallery />
      <CTA />
      <Footer />
    </div>
  );
}
