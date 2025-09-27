import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendAnalysis = ({ trendData, selectedMetric, onMetricChange }) => {
  const metrics = [
    { value: 'overall', label: 'Overall Wellness', icon: 'TrendingUp', color: '#2563EB' },
    { value: 'depression', label: 'Depression', icon: 'CloudRain', color: '#EF4444' },
    { value: 'anxiety', label: 'Anxiety', icon: 'Zap', color: '#F59E0B' },
    { value: 'stress', label: 'Stress', icon: 'Target', color: '#EF4444' },
    { value: 'sleep', label: 'Sleep Quality', icon: 'Moon', color: '#8B5CF6' },
    { value: 'academic', label: 'Academic Stress', icon: 'BookOpen', color: '#059669' }
  ];

  const currentMetric = metrics?.find(m => m?.value === selectedMetric) || metrics?.[0];

  const formatTooltip = (value, name) => {
    return [`${value}%`, name];
  };

  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getScoreInterpretation = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-success' };
    if (score >= 60) return { text: 'Good', color: 'text-warning' };
    if (score >= 40) return { text: 'Fair', color: 'text-warning' };
    return { text: 'Needs Attention', color: 'text-destructive' };
  };

  const calculateTrend = () => {
    if (!trendData || trendData?.length < 2) return { direction: 'stable', percentage: 0 };
    
    const recent = trendData?.[trendData?.length - 1]?.[selectedMetric];
    const previous = trendData?.[trendData?.length - 2]?.[selectedMetric];
    const change = ((recent - previous) / previous) * 100;
    
    if (Math.abs(change) < 5) return { direction: 'stable', percentage: Math.abs(change) };
    return { 
      direction: change > 0 ? 'improving' : 'declining', 
      percentage: Math.abs(change) 
    };
  };

  const trend = calculateTrend();
  const latestScore = trendData && trendData?.length > 0 ? trendData?.[trendData?.length - 1]?.[selectedMetric] : 0;
  const interpretation = getScoreInterpretation(latestScore);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-card-foreground">
            Trend Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress over time
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Export Data
        </Button>
      </div>
      {/* Metric Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {metrics?.map((metric) => (
            <button
              key={metric?.value}
              onClick={() => onMetricChange(metric?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedMetric === metric?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-card-foreground'
              }`}
            >
              <Icon name={metric?.icon} size={14} />
              <span>{metric?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-card-foreground">{latestScore}%</div>
          <div className="text-sm text-muted-foreground">Current Score</div>
          <div className={`text-xs font-medium mt-1 ${interpretation?.color}`}>
            {interpretation?.text}
          </div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center space-x-1">
            <Icon 
              name={trend?.direction === 'improving' ? 'TrendingUp' : 
                    trend?.direction === 'declining' ? 'TrendingDown' : 'Minus'} 
              size={20} 
              className={trend?.direction === 'improving' ? 'text-success' : 
                        trend?.direction === 'declining' ? 'text-destructive' : 'text-warning'}
            />
            <span className={`text-xl font-bold ${
              trend?.direction === 'improving' ? 'text-success' : 
              trend?.direction === 'declining' ? 'text-destructive' : 'text-warning'
            }`}>
              {trend?.percentage?.toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-muted-foreground">Change</div>
          <div className="text-xs font-medium mt-1 capitalize">{trend?.direction}</div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-card-foreground">
            {trendData ? trendData?.length : 0}
          </div>
          <div className="text-sm text-muted-foreground">Data Points</div>
          <div className="text-xs font-medium mt-1 text-muted-foreground">
            Last 30 days
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="mb-6">
        <div className="h-64 w-full">
          {trendData && trendData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Date: ${formatXAxisLabel(label)}`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={currentMetric?.color}
                  strokeWidth={3}
                  dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentMetric?.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
              <div className="text-center">
                <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-card-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">
                  Complete more assessments to see your progress trends
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Insights */}
      {trendData && trendData?.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-card-foreground">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="TrendingUp" size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-card-foreground">Progress Pattern</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {trend?.direction === 'improving' ? 
                      `Your ${currentMetric?.label?.toLowerCase()} scores have improved by ${trend?.percentage?.toFixed(1)}% recently.` :
                      trend?.direction === 'declining' ?
                      `Your ${currentMetric?.label?.toLowerCase()} scores have declined by ${trend?.percentage?.toFixed(1)}%. Consider additional support.` :
                      `Your ${currentMetric?.label?.toLowerCase()} scores remain stable with minimal variation.`
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Target" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-card-foreground">Recommendation</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {latestScore >= 80 ? 
                      "Maintain your current wellness practices and continue regular check-ins." :
                      latestScore >= 60 ?
                      "Consider exploring additional resources to further improve your wellbeing." : "We recommend scheduling a consultation with a mental health professional."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;