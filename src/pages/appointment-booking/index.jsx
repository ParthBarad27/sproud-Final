import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import ConsultantCard from './components/ConsultantCard';
import AppointmentCalendar from './components/AppointmentCalendar';
import PreSessionForm from './components/PreSessionForm';
import SmartMatchingFilters from './components/SmartMatchingFilters';
import AppointmentConfirmation from './components/AppointmentConfirmation';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('browse'); // browse, calendar, form, confirmation
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('compatibility');
  const [filters, setFilters] = useState({});
  const [appointmentData, setAppointmentData] = useState(null);

  // Mock consultant data
  const consultants = [
    {
      id: 1,
      name: "Priya Sharma",
      credentials: "PhD, Clinical Psychology",
      experience: 8,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      specializations: ["Anxiety & Depression", "Academic Stress", "Crisis Intervention"],
      languages: ["English", "Hindi", "Punjabi"],
      therapeuticApproach: "CBT",
      rating: 4.9,
      reviewCount: 127,
      compatibilityScore: 94,
      nextAvailable: "Today 2:00 PM",
      isOnline: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      credentials: "MD, Psychiatry",
      experience: 12,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      specializations: ["Relationship Issues", "Family Therapy", "Career Counseling"],
      languages: ["English", "Hindi", "Tamil"],
      therapeuticApproach: "Humanistic",
      rating: 4.8,
      reviewCount: 89,
      compatibilityScore: 87,
      nextAvailable: "Tomorrow 10:00 AM",
      isOnline: false
    },
    {
      id: 3,
      name: "Anita Desai",
      credentials: "MSc, Counseling Psychology",
      experience: 6,
      avatar: "https://images.unsplash.com/photo-1594824388853-d0c2d4e5b5e5?w=400&h=400&fit=crop&crop=face",
      specializations: ["Sleep Disorders", "Eating Disorders", "Trauma Therapy"],
      languages: ["English", "Gujarati", "Marathi"],
      therapeuticApproach: "Mindfulness-Based",
      rating: 4.7,
      reviewCount: 156,
      compatibilityScore: 82,
      nextAvailable: "Today 4:00 PM",
      isOnline: true
    },
    {
      id: 4,
      name: "Mohammed Ali",
      credentials: "PhD, Clinical Psychology",
      experience: 15,
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      specializations: ["Crisis Intervention", "Addiction Support", "Academic Stress"],
      languages: ["English", "Hindi", "Urdu"],
      therapeuticApproach: "Integrative",
      rating: 4.9,
      reviewCount: 203,
      compatibilityScore: 91,
      nextAvailable: "Today 6:00 PM",
      isOnline: true
    },
    {
      id: 5,
      name: "Lakshmi Iyer",
      credentials: "MSc, Family Therapy",
      experience: 10,
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
      specializations: ["Family Therapy", "Relationship Issues", "Cultural Issues"],
      languages: ["English", "Tamil", "Malayalam"],
      therapeuticApproach: "Solution-Focused",
      rating: 4.6,
      reviewCount: 94,
      compatibilityScore: 78,
      nextAvailable: "Tomorrow 11:00 AM",
      isOnline: false
    },
    {
      id: 6,
      name: "Vikram Singh",
      credentials: "PhD, Behavioral Psychology",
      experience: 9,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specializations: ["Anxiety & Depression", "Sleep Disorders", "Academic Stress"],
      languages: ["English", "Hindi", "Bengali"],
      therapeuticApproach: "CBT",
      rating: 4.8,
      reviewCount: 112,
      compatibilityScore: 89,
      nextAvailable: "Today 3:00 PM",
      isOnline: true
    }
  ];

  const sortOptions = [
    { value: 'compatibility', label: 'Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'availability', label: 'Earliest Available' },
    { value: 'reviews', label: 'Most Reviews' }
  ];

  const filteredAndSortedConsultants = consultants?.filter(consultant => {
      if (searchQuery) {
        const query = searchQuery?.toLowerCase();
        return (consultant?.name?.toLowerCase()?.includes(query) ||
        consultant?.specializations?.some(spec => spec?.toLowerCase()?.includes(query)) || consultant?.therapeuticApproach?.toLowerCase()?.includes(query));
      }
      return true;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'compatibility':
          return b?.compatibilityScore - a?.compatibilityScore;
        case 'rating':
          return b?.rating - a?.rating;
        case 'experience':
          return b?.experience - a?.experience;
        case 'reviews':
          return b?.reviewCount - a?.reviewCount;
        default:
          return b?.compatibilityScore - a?.compatibilityScore;
      }
    });

  const handleConsultantSelect = (consultant) => {
    setSelectedConsultant(consultant);
    setCurrentStep('calendar');
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleProceedToForm = () => {
    if (selectedTimeSlot) {
      setCurrentStep('form');
    }
  };

  const handleFormSubmit = (formData) => {
    const appointment = {
      consultant: selectedConsultant,
      date: selectedTimeSlot?.date,
      time: selectedTimeSlot?.time,
      sessionType: selectedTimeSlot?.type,
      ...formData
    };
    setAppointmentData(appointment);
    setCurrentStep('confirmation');
  };

  const handleBackToConsultants = () => {
    setCurrentStep('browse');
    setSelectedConsultant(null);
    setSelectedTimeSlot(null);
  };

  const handleBackToCalendar = () => {
    setCurrentStep('calendar');
  };

  const handleNewAppointment = () => {
    setCurrentStep('browse');
    setSelectedConsultant(null);
    setSelectedTimeSlot(null);
    setAppointmentData(null);
  };

  const handleViewDashboard = () => {
    navigate('/student-dashboard');
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'browse', label: 'Select Consultant', icon: 'Users' },
      { key: 'calendar', label: 'Choose Time', icon: 'Calendar' },
      { key: 'form', label: 'Session Details', icon: 'FileText' },
      { key: 'confirmation', label: 'Confirmation', icon: 'CheckCircle' }
    ];

    const currentIndex = steps?.findIndex(step => step?.key === currentStep);

    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps?.map((step, index) => (
          <div key={step?.key} className="flex items-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              index <= currentIndex
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={step?.icon} size={16} />
              <span className="text-sm font-medium hidden sm:inline">{step?.label}</span>
            </div>
            {index < steps?.length - 1 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className={`mx-2 ${index < currentIndex ? 'text-primary' : 'text-muted-foreground'}`} 
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Book Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with qualified mental health professionals through our smart matching system. 
              Your privacy and anonymity are completely protected.
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Browse Consultants Step */}
          {currentStep === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="search"
                        placeholder="Search by name, specialization, or approach..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e?.target?.value)}
                        className="w-full"
                      />
                    </div>
                    <Select
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                      placeholder="Sort by"
                      className="sm:w-48"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <SmartMatchingFilters
                    onFiltersChange={setFilters}
                    activeFilters={filters}
                  />
                </div>

                {/* Consultants List */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredAndSortedConsultants?.length} consultants
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      <span className="text-sm text-muted-foreground">
                        AI-powered matching active
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredAndSortedConsultants?.map((consultant) => (
                      <ConsultantCard
                        key={consultant?.id}
                        consultant={consultant}
                        onSelect={handleConsultantSelect}
                        isSelected={selectedConsultant?.id === consultant?.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Step */}
          {currentStep === 'calendar' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  onClick={handleBackToConsultants}
                >
                  Back to Consultants
                </Button>
                <div className="text-sm text-muted-foreground">
                  Step 2 of 4
                </div>
              </div>

              <AppointmentCalendar
                selectedConsultant={selectedConsultant}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
              />

              {selectedTimeSlot && (
                <div className="flex justify-center">
                  <Button
                    variant="default"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={handleProceedToForm}
                    className="breathing-animation"
                  >
                    Continue to Session Details
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Pre-Session Form Step */}
          {currentStep === 'form' && (
            <div className="max-w-4xl mx-auto">
              <PreSessionForm
                selectedConsultant={selectedConsultant}
                selectedTimeSlot={selectedTimeSlot}
                onSubmit={handleFormSubmit}
                onBack={handleBackToCalendar}
              />
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && appointmentData && (
            <AppointmentConfirmation
              appointmentData={appointmentData}
              onNewAppointment={handleNewAppointment}
              onViewDashboard={handleViewDashboard}
            />
          )}
        </div>
      </main>
      {/* Quick Actions - Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <div className="flex flex-col space-y-3">
          <Button
            variant="destructive"
            size="icon"
            className="w-12 h-12 rounded-full shadow-gentle-hover"
            iconName="Phone"
            iconSize={20}
            onClick={() => window.open('tel:1800-599-0019')}
          />
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-gentle"
            iconName="MessageCircle"
            iconSize={16}
            onClick={() => navigate('/ai-assistant-chat')}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;