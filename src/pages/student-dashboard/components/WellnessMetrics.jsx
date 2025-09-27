import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { WellnessService } from '../../../services/wellnessService';
import { MoodService } from '../../../services/moodService';
import { useAuth } from '../../../contexts/AuthContext';

const WellnessMetrics = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [metrics, setMetrics] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadWellnessData();
    }
  }, [user?.id, selectedPeriod]);

  const loadWellnessData = async () => {
    setLoading(true);
    setError(null);

    try {
      const days = selectedPeriod === 'week' ? 7 : 30;
      
      // Load wellness metrics
      const { data: metricsData, error: metricsError } = await WellnessService?.getWellnessMetrics(
        user?.id, 
        days
      );
      
      // Load mood stats
      const { data: moodStats, error: moodError } = await MoodService?.getMoodStats(
        user?.id, 
        days
      );
      
      // Load wellness goals
      const { data: goalsData, error: goalsError } = await WellnessService?.getWellnessGoals(user?.id);

      if (metricsError || moodError || goalsError) {
        setError('Failed to load wellness data');
      } else {
        setMetrics({ ...metricsData, ...moodStats });
        setGoals(goalsData?.slice(0, 3) || []); // Show top 3 goals
      }
    } catch (err) {
      setError('Unable to load wellness metrics');
      console.error('Error loading wellness data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default metrics for when data is not available
  const getDefaultMetrics = () => [
    {
      id: 1,
      title: "Mood Entries",
      value: metrics?.moodEntries || 0,
      change: `${metrics?.moodEntries || 0} this ${selectedPeriod}`,
      icon: "Heart",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      id: 2,
      title: "Average Mood",
      value: metrics?.averageMood ? `${metrics?.averageMood}/5` : 'No data',
      change: metrics?.trend === 'improving' ? 'Improving' : 
              metrics?.trend === 'declining' ? 'Needs attention' : 'Stable',
      icon: "Brain",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      id: 3,
      title: "Avg Sleep",
      value: metrics?.averageSleep ? `${metrics?.averageSleep} hrs` : 'No data',
      change: "Track sleep quality",
      icon: "Moon",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 4,
      title: "Stress Level",
      value: metrics?.averageStress ? `${metrics?.averageStress}/5` : 'No data',
      change: "Monitor stress",
      icon: "Activity",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Wellness Metrics</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading wellness data...</div>
      </div>
    );
  }

  const displayMetrics = getDefaultMetrics();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Wellness Metrics</h3>
        </div>
        <div className="flex space-x-1">
          {['week', 'month']?.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'week' ? 'Week' : 'Month'}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={loadWellnessData}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {displayMetrics?.map((metric) => (
            <div key={metric?.id} className={`${metric?.bgColor} rounded-lg p-4`}>
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={metric?.icon} size={16} className={metric?.color} />
                <span className="text-sm font-medium text-card-foreground">{metric?.title}</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-card-foreground">{metric?.value}</p>
                <p className="text-xs text-muted-foreground">{metric?.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Goals Progress */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Active Goals</h4>
          {goals?.length > 0 ? (
            <div className="space-y-3">
              {goals?.map((goal) => {
                const progress = calculateProgress(goal?.current_value, goal?.target_value);
                return (
                  <div key={goal?.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">{goal?.title}</span>
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal?.current_value || 0} {goal?.unit}</span>
                      <span>{goal?.target_value} {goal?.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No active goals</p>
              <Button variant="ghost" size="sm" className="mt-2">
                Set Your First Goal
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resources used</span>
              <span className="font-medium text-card-foreground">{metrics?.resourcesAccessed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium text-card-foreground">{metrics?.completedResources || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active goals</span>
              <span className="font-medium text-card-foreground">{metrics?.activeGoals || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Achieved</span>
              <span className="font-medium text-success">{metrics?.achievedGoals || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessMetrics;