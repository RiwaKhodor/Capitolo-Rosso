import Footer from '../home/components/Footer';
import Hero from './components/Hero';
import ContactChannels from './components/ContactChannels';
import LocationContact from './components/LocationContact';
import Directions from './components/Directions';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#410704]">
      <Hero />
      <ContactChannels />
      <LocationContact />
      <Directions />
      <Footer />
    </div>
  );
}
