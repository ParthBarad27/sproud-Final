import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AssessmentCard from './components/AssessmentCard';
import AssessmentProgress from './components/AssessmentProgress';
import AssessmentFilters from './components/AssessmentFilters';
import RecentResults from './components/RecentResults';
import QuickActions from './components/QuickActions';
import TrendAnalysis from './components/TrendAnalysis';

const AssessmentCenter = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('assessments');

  // Mock assessments data
  const assessments = [
    {
      id: 'phq-9',
      name: 'PHQ-9 Depression Scale',
      category: 'depression',
      description: 'Comprehensive assessment for depression symptoms and severity levels using the Patient Health Questionnaire.',
      icon: 'CloudRain',
      estimatedTime: 8,
      questions: 9,
      difficulty: 'basic',
      status: 'completed',
      progress: 100,
      isRecommended: true,
      lastCompleted: '15 Dec 2024',
      lastScore: { value: 12, severity: 'moderate' }
    },
    {
      id: 'gad-7',
      name: 'GAD-7 Anxiety Assessment',
      category: 'anxiety',
      description: 'Generalized Anxiety Disorder assessment to evaluate anxiety symptoms and their impact on daily functioning.',
      icon: 'Zap',
      estimatedTime: 6,
      questions: 7,
      difficulty: 'basic',
      status: 'in-progress',
      progress: 60,
      isRequired: true
    },
    {
      id: 'dass-21',
      name: 'DASS-21 Comprehensive Scale',
      category: 'stress',
      description: 'Depression, Anxiety and Stress Scale measuring emotional states across three dimensions.',
      icon: 'Target',
      estimatedTime: 12,
      questions: 21,
      difficulty: 'intermediate',
      status: 'not-started',
      progress: 0,
      isRecommended: true
    },
    {
      id: 'psqi',
      name: 'Pittsburgh Sleep Quality Index',
      category: 'sleep',
      description: 'Comprehensive sleep quality assessment measuring sleep patterns, disturbances, and daytime dysfunction.',
      icon: 'Moon',
      estimatedTime: 10,
      questions: 19,
      difficulty: 'intermediate',
      status: 'completed',
      progress: 100,
      lastCompleted: '12 Dec 2024',
      lastScore: { value: 8, severity: 'moderate' }
    },
    {
      id: 'academic-stress',
      name: 'Academic Stress Scale',
      category: 'academic',
      description: 'Specialized assessment for academic-related stress, pressure, and performance anxiety in educational settings.',
      icon: 'BookOpen',
      estimatedTime: 15,
      questions: 25,
      difficulty: 'advanced',
      status: 'not-started',
      progress: 0
    },
    {
      id: 'social-support',
      name: 'Social Support Assessment',
      category: 'social',
      description: 'Evaluation of social connections, support networks, and interpersonal relationships quality.',
      icon: 'Users',
      estimatedTime: 8,
      questions: 12,
      difficulty: 'basic',
      status: 'in-progress',
      progress: 25
    }
  ];

  // Mock recent results data
  const recentResults = [
    {
      id: 'result-1',
      assessmentName: 'PHQ-9 Depression Scale',
      icon: 'CloudRain',
      completedDate: '2024-12-15',
      score: 12,
      severity: 'Moderate',
      percentile: 65,
      trend: 'improving',
      reliability: 94,
      completionTime: 7,
      accuracy: 98,
      keyInsights: [
        'Sleep disturbances are the primary concern area',
        'Mood improvements noted compared to previous assessment'
      ]
    },
    {
      id: 'result-2',
      assessmentName: 'Pittsburgh Sleep Quality Index',
      icon: 'Moon',
      completedDate: '2024-12-12',
      score: 8,
      severity: 'Moderate',
      percentile: 58,
      trend: 'stable',
      reliability: 91,
      completionTime: 9,
      accuracy: 96,
      keyInsights: [
        'Sleep latency has improved significantly',
        'Weekend sleep patterns differ from weekdays'
      ]
    }
  ];

  // Mock trend data
  const trendData = [
    { date: '2024-11-15', overall: 65, depression: 70, anxiety: 60, stress: 55, sleep: 45, academic: 50 },
    { date: '2024-11-22', overall: 68, depression: 72, anxiety: 65, stress: 58, sleep: 50, academic: 55 },
    { date: '2024-11-29', overall: 70, depression: 75, anxiety: 68, stress: 62, sleep: 55, academic: 58 },
    { date: '2024-12-06', overall: 73, depression: 78, anxiety: 70, stress: 65, sleep: 60, academic: 62 },
    { date: '2024-12-13', overall: 75, depression: 80, anxiety: 72, stress: 68, sleep: 65, academic: 65 },
    { date: '2024-12-20', overall: 78, depression: 82, anxiety: 75, stress: 70, sleep: 68, academic: 68 }
  ];

  // Filter assessments based on selected filters
  const filteredAssessments = assessments?.filter(assessment => {
    const categoryMatch = selectedCategory === 'all' || assessment?.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || assessment?.status === selectedStatus;
    const difficultyMatch = selectedDifficulty === 'all' || assessment?.difficulty === selectedDifficulty;
    return categoryMatch && statusMatch && difficultyMatch;
  });

  // Calculate progress statistics
  const totalAssessments = assessments?.length;
  const completedAssessments = assessments?.filter(a => a?.status === 'completed')?.length;
  const inProgressAssessments = assessments?.filter(a => a?.status === 'in-progress')?.length;
  const overallScore = Math.round(
    assessments?.filter(a => a?.status === 'completed' && a?.lastScore)?.reduce((acc, a) => acc + (100 - a?.lastScore?.value * 5), 0) / 
    Math.max(1, assessments?.filter(a => a?.status === 'completed' && a?.lastScore)?.length)
  );

  const handleStartAssessment = (assessmentId) => {
    console.log('Starting assessment:', assessmentId);
    // Navigate to assessment interface or show modal
  };

  const handleContinueAssessment = (assessmentId) => {
    console.log('Continuing assessment:', assessmentId);
    // Navigate to assessment interface with saved progress
  };

  const handleViewResults = (assessmentId) => {
    console.log('Viewing results for:', assessmentId);
    // Navigate to results page or show detailed modal
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    if (actionId === 'crisis-assessment') {
      // Handle crisis assessment with immediate priority
      alert('Redirecting to crisis assessment...');
    }
    // Handle other quick actions
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedDifficulty('all');
  };

  const tabs = [
    { id: 'assessments', label: 'Assessments', icon: 'ClipboardList' },
    { id: 'results', label: 'Results', icon: 'BarChart3' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'quick', label: 'Quick Actions', icon: 'Zap' }
  ];

  useEffect(() => {
    // Set page title
    document.title = 'Assessment Center - MindBridge Platform';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground">
                  Assessment Center
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive mental health evaluation through validated psychological instruments
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Filter"
                  iconPosition="left"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                >
                  Schedule Assessment
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mb-8">
            <AssessmentProgress
              totalAssessments={totalAssessments}
              completedAssessments={completedAssessments}
              inProgressAssessments={inProgressAssessments}
              overallScore={overallScore}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'assessments' && (
              <>
                {/* Filters */}
                {showFilters && (
                  <div className="mb-6">
                    <AssessmentFilters
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      selectedDifficulty={selectedDifficulty}
                      onDifficultyChange={setSelectedDifficulty}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                )}

                {/* Assessment Grid */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading font-semibold text-xl text-foreground">
                      Available Assessments
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredAssessments?.length} of {totalAssessments} assessments
                    </div>
                  </div>
                  
                  {filteredAssessments?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAssessments?.map((assessment) => (
                        <AssessmentCard
                          key={assessment?.id}
                          assessment={assessment}
                          onStart={handleStartAssessment}
                          onContinue={handleContinueAssessment}
                          onViewResults={handleViewResults}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Search" size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                        No Assessments Found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters to see more assessments
                      </p>
                      <Button
                        variant="outline"
                        iconName="RotateCcw"
                        iconPosition="left"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'results' && (
              <RecentResults
                results={recentResults}
                onViewDetails={handleViewResults}
              />
            )}

            {activeTab === 'trends' && (
              <TrendAnalysis
                trendData={trendData}
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
              />
            )}

            {activeTab === 'quick' && (
              <QuickActions onAction={handleQuickAction} />
            )}
          </div>

          {/* Mobile Action Button */}
          <div className="fixed bottom-6 right-6 md:hidden z-50">
            <Button
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full shadow-gentle-hover breathing-animation"
              iconName="Plus"
              iconSize={24}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentCenter;