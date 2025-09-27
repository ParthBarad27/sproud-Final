import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Assessments from './components/Assessments.jsx'
import Academic from './components/Academic.jsx'
import SleepLifestyle from './components/SleepLifestyle.jsx'
import MoodTracker from './components/MoodTracker.jsx'
import Risk from './components/Risk.jsx'
import Community from './components/Community.jsx'
import Gamification from './components/Gamification.jsx'
import SOS from './components/SOS.jsx'
import Settings from './components/Settings.jsx'
import Goals from './components/Goals.jsx'
import Reports from './components/Reports.jsx'

export default function App(){
  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/sleep" element={<SleepLifestyle />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/community" element={<Community />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  )
}
