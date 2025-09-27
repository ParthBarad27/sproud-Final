import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentResults = ({ results, onViewDetails }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minimal': case'low':
        return 'text-success bg-success/10 border-success/20';
      case 'mild': case'moderate':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'severe': case'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minimal': case'low':
        return 'CheckCircle';
      case 'mild': case'moderate':
        return 'AlertTriangle';
      case 'severe': case'high':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!results || results?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ClipboardList" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
            No Results Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your first assessment to see results here
          </p>
          <Button variant="default" iconName="Play" iconPosition="left">
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-card-foreground">
            Recent Results
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your latest assessment outcomes
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {results?.map((result) => (
          <div
            key={result?.id}
            className="border border-border rounded-lg p-4 hover:shadow-gentle transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={result?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">{result?.assessmentName}</h4>
                  <p className="text-xs text-muted-foreground">{formatDate(result?.completedDate)}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getSeverityColor(result?.severity)}`}>
                <Icon name={getSeverityIcon(result?.severity)} size={12} />
                <span>{result?.severity}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">{result?.score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">{result?.percentile}%</div>
                <div className="text-xs text-muted-foreground">Percentile</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${result?.trend === 'improving' ? 'text-success' : 
                  result?.trend === 'stable' ? 'text-warning' : 'text-destructive'}`}>
                  <Icon 
                    name={result?.trend === 'improving' ? 'TrendingUp' : 
                          result?.trend === 'stable' ? 'Minus' : 'TrendingDown'} 
                    size={20} 
                  />
                </div>
                <div className="text-xs text-muted-foreground capitalize">{result?.trend}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-card-foreground">{result?.reliability}%</div>
                <div className="text-xs text-muted-foreground">Reliability</div>
              </div>
            </div>

            {result?.keyInsights && result?.keyInsights?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-card-foreground mb-2">Key Insights:</h5>
                <ul className="space-y-1">
                  {result?.keyInsights?.slice(0, 2)?.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2 text-xs text-muted-foreground">
                      <Icon name="ArrowRight" size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{result?.completionTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Target" size={12} />
                  <span>{result?.accuracy}% accuracy</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(result?.id)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentResults;