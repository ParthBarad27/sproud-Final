import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Home from './pages/Home';
import Integrations from './pages/Integrations';
import AdminPanel from './pages/AdminPanel';
import FacultyAnalytics from './pages/FacultyAnalytics';
import ConsultantTools from './pages/ConsultantTools';
import AppointmentBooking from './pages/appointment-booking';
import ResourceLibrary from './pages/resource-library';
import MultiTierAuthentication from './pages/multi-tier-authentication';
import AssessmentCenter from './pages/assessment-center';
import StudentDashboard from './pages/student-dashboard';
import AIAssistantChat from './pages/ai-assistant-chat';
import { useAuth } from './contexts/AuthContext';


const ProtectedRoute = ({ element, allow }) => {
  const { role } = useAuth();
  if (!allow || allow.includes(role)) {
    return element;
  }
  return <NotFound />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Home />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/multi-tier-authentication" element={<MultiTierAuthentication />} />
        <Route path="/assessment-center" element={<ProtectedRoute element={<AssessmentCenter />} allow={["","student","faculty","admin"]} />} />
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} allow={["","student","consultant","faculty","admin"]} />} />
        <Route path="/ai-assistant-chat" element={<AIAssistantChat />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allow={["admin"]} />} />
        <Route path="/faculty-analytics" element={<ProtectedRoute element={<FacultyAnalytics />} allow={["faculty","admin"]} />} />
        <Route path="/consultant-tools" element={<ProtectedRoute element={<ConsultantTools />} allow={["consultant","admin"]} />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
