import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Hero from './components/Hero.jsx';
import Capabilities from './components/Capabilities.jsx';
import Pipeline from './components/Pipeline.jsx';
import Demo from './components/Demo.jsx';
import Waitlist from './components/Waitlist.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const SPORTS = ['Basketball', 'Tennis', 'Weightlifting', 'Martial Arts', 'Golf'];

export default function App() {
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastTimer = useRef();

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const scrollToDemo = useCallback((sport) => {
    if (sport) setSelectedSport(sport);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>
      <Hero
        onTryDemo={() => scrollToId('demo')}
        onSeeHow={() => scrollToId('how-it-works')}
        onSelectSport={scrollToDemo}
      />
      <Demo
        sports={SPORTS}
        selectedSport={selectedSport}
        onSportChange={setSelectedSport}
        showToast={showToast}
      />
      <Capabilities />
      <Pipeline />
      <Waitlist showToast={showToast} />
      <Footer />
      <Toast toast={toast} />
      <Analytics />
    </div>
  );
}
