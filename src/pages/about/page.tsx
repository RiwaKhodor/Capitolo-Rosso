
import Hero from './components/Hero';
import Story from './components/Story';
import Philosophy from './components/Philosophy';
import Team from './components/Team';
import Experience from './components/Experience';
import Services from './components/Services';
import ContactInfo from './components/ContactInfo';
import Footer from '../home/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#410704]">
      <Hero />
      <Story />
      <Philosophy />
      <Team />
      <Experience />
      <Services />
      <ContactInfo />
      <Footer />
    </div>
  );
}
