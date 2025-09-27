import React from 'react';
import Icon from '../../../components/AppIcon';

const AssessmentProgress = ({ totalAssessments, completedAssessments, inProgressAssessments, overallScore }) => {
  const completionPercentage = Math.round((completedAssessments / totalAssessments) * 100);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-xl text-card-foreground">
            Assessment Progress
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your mental health evaluation journey
          </p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={24} className="text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">{totalAssessments}</div>
          <div className="text-xs text-muted-foreground">Total Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{completedAssessments}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{inProgressAssessments}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </div>
          <div className="text-xs text-muted-foreground">Overall Score</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completion Progress</span>
            <span className="font-medium text-card-foreground">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {overallScore > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Wellness Score</span>
              <span className={`font-medium ${getScoreColor(overallScore)}`}>{overallScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  overallScore >= 80 ? 'bg-success' : 
                  overallScore >= 60 ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${overallScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {overallScore > 0 && (
        <div className={`mt-4 p-4 rounded-lg ${getScoreBackground(overallScore)}`}>
          <div className="flex items-start space-x-3">
            <Icon 
              name={overallScore >= 80 ? "CheckCircle" : overallScore >= 60 ? "AlertTriangle" : "AlertCircle"} 
              size={20} 
              className={getScoreColor(overallScore)}
            />
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${getScoreColor(overallScore)}`}>
                {overallScore >= 80 ? "Excellent Progress!" : 
                 overallScore >= 60 ? "Good Progress" : "Needs Attention"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {overallScore >= 80 ? 
                  "Your mental health indicators are showing positive trends. Keep up the great work!" :
                  overallScore >= 60 ?
                  "You're making good progress. Consider exploring additional resources for continued improvement." :
                  "Your assessments indicate areas that may benefit from professional support. Consider scheduling a consultation."
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentProgress;