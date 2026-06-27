import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Capabilities from './components/Capabilities.jsx';
import Pipeline from './components/Pipeline.jsx';
import Demo from './components/Demo.jsx';
import Waitlist from './components/Waitlist.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import FounderModal from './components/FounderModal.jsx';
import { hasJoinedWaitlist } from './utils/waitlist.js';
import { SPORTS } from './utils/sports.js';

export default function App() {
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFounder, setShowFounder] = useState(false);
  const toastTimer = useRef();

  // Lock scroll while the founder modal is open; restores the moment it closes.
  useEffect(() => {
    document.body.style.overflow = showFounder ? 'hidden' : '';
  }, [showFounder]);

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // When the intro finishes, show the founder note unless they have already
  // signed up. Closing it with X does not persist, so it returns on reload.
  const finishLoading = useCallback(() => {
    setLoading(false);
    if (!hasJoinedWaitlist()) setShowFounder(true);
  }, []);

  const navigate = useCallback((id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToDemo = useCallback((sport) => {
    if (sport) setSelectedSport(sport);
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <AnimatePresence>
        {loading && <LoadingScreen onDone={finishLoading} />}
      </AnimatePresence>

      <AnimatePresence>
        {showFounder && (
          <FounderModal
            onClose={() => setShowFounder(false)}
            onJoined={() => setShowFounder(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      <Nav onNavigate={navigate} onJoin={() => navigate('waitlist')} />

      <main>
        <Hero
          onTryDemo={() => navigate('demo')}
          onSeeHow={() => navigate('how-it-works')}
          onSelectSport={scrollToDemo}
        />
        <Marquee />
        <Demo
          sports={SPORTS}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          showToast={showToast}
        />
        <Capabilities />
        <Pipeline />
        <Waitlist showToast={showToast} />
      </main>

      <Footer onNavigate={navigate} />
      <Toast toast={toast} />
    </div>
  );
}
