import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AppointmentConfirmation = ({ appointmentData, onNewAppointment, onViewDashboard }) => {
  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSessionTypeDetails = (type) => {
    const details = {
      individual: {
        icon: 'User',
        title: 'Individual Session',
        description: 'One-on-one therapy session',
        duration: '50 minutes',
        color: 'text-primary bg-primary/10'
      },
      group: {
        icon: 'Users',
        title: 'Group Session',
        description: 'Small group therapy session',
        duration: '60 minutes',
        color: 'text-secondary bg-secondary/10'
      },
      crisis: {
        icon: 'AlertTriangle',
        title: 'Crisis Intervention',
        description: 'Emergency support session',
        duration: '30-60 minutes',
        color: 'text-destructive bg-destructive/10'
      }
    };
    return details?.[type] || details?.individual;
  };

  const sessionDetails = getSessionTypeDetails(appointmentData?.sessionType);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          Appointment Confirmed!
        </h2>
        <p className="text-muted-foreground">
          Your session has been successfully scheduled. You'll receive a confirmation email shortly.
        </p>
      </div>
      {/* Appointment Details Card */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Appointment Details
          </h3>
          <div className="text-sm text-muted-foreground">
            Booking ID: #MB{Math.random()?.toString()?.substr(2, 6)}
          </div>
        </div>

        {/* Consultant Info */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-muted rounded-lg">
          <Image
            src={appointmentData?.consultant?.avatar}
            alt={`Dr. ${appointmentData?.consultant?.name}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-card-foreground text-lg">
              Dr. {appointmentData?.consultant?.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {appointmentData?.consultant?.credentials} • {appointmentData?.consultant?.specializations?.[0]}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Globe" size={14} />
                <span>{appointmentData?.consultant?.languages?.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-accent fill-current" />
                <span>{appointmentData?.consultant?.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-card-foreground">
                  {formatDate(appointmentData?.date)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {appointmentData?.time}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon name={sessionDetails?.icon} size={20} className="text-primary" />
              <div>
                <div className="font-medium text-card-foreground">
                  {sessionDetails?.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {sessionDetails?.description} • {sessionDetails?.duration}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="MapPin" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-card-foreground">
                  Online Session
                </div>
                <div className="text-sm text-muted-foreground">
                  Secure video call via MindBridge platform
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-card-foreground">
                  Anonymous Session
                </div>
                <div className="text-sm text-muted-foreground">
                  Your identity remains protected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Goals */}
        {appointmentData?.sessionGoals && (
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg mb-6">
            <h4 className="font-medium text-card-foreground mb-2 flex items-center space-x-2">
              <Icon name="Target" size={16} />
              <span>Session Goals</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              {appointmentData?.sessionGoals}
            </p>
          </div>
        )}

        {/* Primary Concerns */}
        {appointmentData?.primaryConcerns && appointmentData?.primaryConcerns?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-card-foreground mb-3 flex items-center space-x-2">
              <Icon name="Heart" size={16} />
              <span>Areas of Focus</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {appointmentData?.primaryConcerns?.map((concern, index) => (
                <div key={index} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  {concern?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Next Steps */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          What happens next?
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary-foreground font-medium">1</span>
            </div>
            <div>
              <div className="font-medium text-card-foreground">
                Confirmation Email
              </div>
              <div className="text-sm text-muted-foreground">
                You'll receive a confirmation email with session details and preparation materials
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary-foreground font-medium">2</span>
            </div>
            <div>
              <div className="font-medium text-card-foreground">
                Pre-Session Reminder
              </div>
              <div className="text-sm text-muted-foreground">
                24 hours before your session, you'll get a reminder with the secure meeting link
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-primary-foreground font-medium">3</span>
            </div>
            <div>
              <div className="font-medium text-card-foreground">
                Join Your Session
              </div>
              <div className="text-sm text-muted-foreground">
                Access your session through the MindBridge platform 5 minutes before the scheduled time
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Contact */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-destructive mt-0.5" />
          <div>
            <h4 className="font-medium text-card-foreground mb-1">
              Need Immediate Support?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you're experiencing a mental health crisis before your scheduled appointment, don't wait.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="destructive" size="sm" iconName="Phone" iconPosition="left">
                Crisis Hotline: 1800-599-0019
              </Button>
              <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                Emergency Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={onViewDashboard}
          iconName="LayoutDashboard"
          iconPosition="left"
          fullWidth
        >
          Go to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={onNewAppointment}
          iconName="Plus"
          iconPosition="left"
          fullWidth
        >
          Book Another Appointment
        </Button>
      </div>
      {/* Calendar Integration */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Add this appointment to your calendar
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="ghost" size="sm" iconName="Calendar">
            Google Calendar
          </Button>
          <Button variant="ghost" size="sm" iconName="Calendar">
            Outlook
          </Button>
          <Button variant="ghost" size="sm" iconName="Download">
            Download .ics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;