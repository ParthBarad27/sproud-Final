import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTracker = ({ 
  weeklyProgress, 
  streaks, 
  achievements, 
  onViewDetails 
}) => {
  const progressData = {
    videosWatched: 12,
    meditationMinutes: 180,
    worksheetsCompleted: 5,
    currentStreak: 7,
    longestStreak: 14,
    totalPoints: 2450
  };

  const weeklyGoals = [
    { 
      type: 'video', 
      label: 'Watch 3 videos', 
      current: 2, 
      target: 3, 
      icon: 'Play',
      color: 'bg-primary'
    },
    { 
      type: 'meditation', 
      label: '60 min meditation', 
      current: 45, 
      target: 60, 
      icon: 'Brain',
      color: 'bg-secondary'
    },
    { 
      type: 'worksheet', 
      label: 'Complete 2 worksheets', 
      current: 1, 
      target: 2, 
      icon: 'FileText',
      color: 'bg-accent'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Mindful Week',
      description: 'Completed 7 days of meditation',
      icon: 'Award',
      color: 'text-success',
      earnedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Knowledge Seeker',
      description: 'Watched 10 educational videos',
      icon: 'BookOpen',
      color: 'text-primary',
      earnedAt: '1 week ago'
    },
    {
      id: 3,
      title: 'Early Bird',
      description: 'Started morning meditation 5 times',
      icon: 'Sunrise',
      color: 'text-warning',
      earnedAt: '2 weeks ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <p className="text-muted-foreground">Track your wellness journey</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="TrendingUp"
          iconPosition="left"
          iconSize={16}
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Play" size={16} className="text-primary" />
            <span className="text-sm font-medium">Videos</span>
          </div>
          <div className="text-2xl font-bold">{progressData?.videosWatched}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} className="text-secondary" />
            <span className="text-sm font-medium">Meditation</span>
          </div>
          <div className="text-2xl font-bold">{progressData?.meditationMinutes}m</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Flame" size={16} className="text-warning" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <div className="text-2xl font-bold">{progressData?.currentStreak}</div>
          <div className="text-xs text-muted-foreground">Days active</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="text-sm font-medium">Points</span>
          </div>
          <div className="text-2xl font-bold">{progressData?.totalPoints}</div>
          <div className="text-xs text-muted-foreground">Total earned</div>
        </div>
      </div>
      {/* Weekly Goals */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Weekly Goals</h3>
          <div className="text-sm text-muted-foreground">
            {new Date()?.toLocaleDateString('en-IN', { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="space-y-4">
          {weeklyGoals?.map((goal, index) => {
            const progress = (goal?.current / goal?.target) * 100;
            const isCompleted = goal?.current >= goal?.target;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${goal?.color} flex items-center justify-center`}>
                      <Icon name={goal?.icon} size={16} color="white" />
                    </div>
                    <span className="font-medium">{goal?.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {goal?.current}/{goal?.target}
                    </span>
                    {isCompleted && (
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-success' : goal?.color
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Achievements</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Award"
            iconPosition="left"
            iconSize={14}
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentAchievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${achievement?.color}`}>
                <Icon name={achievement?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{achievement?.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement?.description}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement?.earnedAt}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Sparkles" size={20} className="text-primary" />
          <h3 className="font-semibold">Keep Going!</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          You're doing great! Complete 2 more activities this week to maintain your streak and unlock the "Consistent Learner" badge.
        </p>
        <Button
          variant="default"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={14}
        >
          Continue Learning
        </Button>
      </div>
    </div>
  );
};

export default ProgressTracker;