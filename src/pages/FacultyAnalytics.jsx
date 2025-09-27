import React from 'react';
import Header from '../components/ui/Header';
import Icon from '../components/AppIcon';

const mockTrends = [
  { date: '2025-09-01', depression: 62, anxiety: 58, stress: 55, sleep: 48 },
  { date: '2025-09-08', depression: 59, anxiety: 57, stress: 54, sleep: 50 },
  { date: '2025-09-15', depression: 57, anxiety: 55, stress: 52, sleep: 52 },
  { date: '2025-09-22', depression: 55, anxiety: 53, stress: 51, sleep: 54 },
];

const Stat = ({ label, value, icon }) => (
  <div className="p-4 bg-card border border-border rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
      <Icon name={icon} size={18} className="text-primary" />
    </div>
  </div>
);

const FacultyAnalytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Faculty Analytics</h1>
            <p className="text-sm text-muted-foreground">Class-wide assessment and wellness trends</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Stat label="Avg Depression" value="58" icon="CloudRain" />
            <Stat label="Avg Anxiety" value="56" icon="Zap" />
            <Stat label="Avg Stress" value="53" icon="Target" />
            <Stat label="Sleep Quality" value="51" icon="Moon" />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTrends.map((t) => (
                <div key={t.date} className="p-4 border border-border rounded">
                  <div className="text-xs text-muted-foreground mb-2">Week of {t.date}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Depression</span><span>{t.depression}</span></div>
                    <div className="flex justify-between"><span>Anxiety</span><span>{t.anxiety}</span></div>
                    <div className="flex justify-between"><span>Stress</span><span>{t.stress}</span></div>
                    <div className="flex justify-between"><span>Sleep</span><span>{t.sleep}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyAnalytics;


