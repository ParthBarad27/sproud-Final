import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const Home = () => {
  const navigate = useNavigate();

  const modules = [
    { id: 'ai', title: 'AI Assistant', desc: '24/7 mental health chatbot', path: '/ai-assistant-chat', icon: 'MessageCircle' },
    { id: 'appointments', title: 'Appointments', desc: 'Smart booking & matching', path: '/appointment-booking', icon: 'Calendar' },
    { id: 'resources', title: 'Resource Library', desc: 'Videos, meditations, worksheets', path: '/resource-library', icon: 'BookOpen' },
    { id: 'assessments', title: 'Assessment Center', desc: 'Validated scales & trends', path: '/assessment-center', icon: 'ClipboardList' },
    { id: 'dashboard', title: 'Dashboard', desc: 'Analytics & progress', path: '/student-dashboard', icon: 'LayoutDashboard' },
    { id: 'account', title: 'Account & Auth', desc: 'Multi-tier authentication', path: '/multi-tier-authentication', icon: 'Shield' },
    { id: 'integrations', title: 'Integrations', desc: 'Access Parts A/C/D/E', path: '/integrations', icon: 'Layers' },
    { id: 'faculty', title: 'Faculty Analytics', desc: 'Class-wide trends (role-gated)', path: '/faculty-analytics', icon: 'BarChart3' },
    { id: 'consultant', title: 'Consultant Tools', desc: 'Session notes & progress (role-gated)', path: '/consultant-tools', icon: 'NotebookPen' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground">MindBridge Prototype</h1>
            <p className="text-muted-foreground mt-2">Unified access to all modules</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(m => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-gentle-hover transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={m.icon} size={18} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
                <Button variant="default" onClick={() => navigate(m.path)} iconName="ArrowRight" iconPosition="right">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;


