import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import WelcomeSection from './components/WelcomeSection';
import AIAssistantCard from './components/AIAssistantCard';
import MoodTracker from './components/MoodTracker';
import QuickActions from './components/QuickActions';
import WellnessMetrics from './components/WellnessMetrics';
import UpcomingAppointments from './components/UpcomingAppointments';
import CommunityActivity from './components/CommunityActivity';
import ResourceHighlights from './components/ResourceHighlights';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const { role, anonymousId } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection 
          anonymousId={anonymousId}
          currentTime={currentTime}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Assistant and Role-Specific Pair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIAssistantCard />
              {role === 'student' && <MoodTracker />}
              {(role === 'consultant' || role === 'faculty' || role === 'admin') && <UpcomingAppointments />}
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Role-Specific Secondary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {role === 'student' && <UpcomingAppointments />}
              {role === 'student' && <CommunityActivity />}            
              {(role === 'consultant' || role === 'faculty' || role === 'admin') && <CommunityActivity />}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <WellnessMetrics />
            <ResourceHighlights />
          </div>
        </div>

        {/* Crisis Support Banner */}
        <div className="mt-8 bg-gradient-to-r from-destructive/10 to-warning/10 border border-destructive/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-destructive-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Need Immediate Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Crisis support is available 24/7. You're not alone in this journey.
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors">
                Emergency Chat
              </button>
              <button className="px-4 py-2 bg-background text-foreground border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                Call Helpline
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} MindBridge Platform</span>
              <span>•</span>
              <span>Your privacy is our priority</span>
              <span>•</span>
              <span>All data encrypted & anonymous</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>System Status: All services operational</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StudentDashboard;