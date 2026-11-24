import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import EmergencyButton from './components/layout/EmergencyButton.jsx';
import Home from './pages/Home.jsx';
import FindBlood from './pages/FindBlood.jsx';
import Hospitals from './pages/Hospitals.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

const dashboardPaths = ['/dashboard', '/hospital-dashboard', '/login', '/register'];

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const bare = dashboardPaths.includes(location.pathname);

  return (
    <div className="relative">
      {!bare && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/find-blood" element={<PageWrapper><FindBlood /></PageWrapper>} />
          <Route path="/hospitals" element={<PageWrapper><Hospitals /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><PatientDashboard /></PageWrapper>} />
          <Route path="/hospital-dashboard" element={<PageWrapper><HospitalDashboard /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!bare && <Footer />}
      {!bare && <EmergencyButton />}
    </div>
  );
}
