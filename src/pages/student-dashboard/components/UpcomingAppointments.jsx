import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { AppointmentsService } from '../../../services/appointmentsService';
import { useAuth } from '../../../contexts/AuthContext';

const UpcomingAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user?.id]);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: appointmentError } = await AppointmentsService?.getAppointments(user?.id);
    
    if (appointmentError) {
      setError(appointmentError?.message || 'Failed to load appointments');
      setAppointments([]);
    } else {
      // Only show upcoming appointments (next 3)
      const now = new Date();
      const upcomingAppointments = data
        ?.filter(apt => new Date(apt?.appointment_date) > now)
        ?.slice(0, 3) || [];
      setAppointments(upcomingAppointments);
    }
    
    setLoading(false);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    const { error: cancelError } = await AppointmentsService?.updateAppointmentStatus(
      appointmentId, 
      'cancelled'
    );
    
    if (cancelError) {
      setError(cancelError?.message || 'Failed to cancel appointment');
    } else {
      await loadAppointments(); // Refresh the list
    }
  };

  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (appointmentDate?.getTime() === today?.getTime()) {
      return 'Today';
    } else if (appointmentDate?.getTime() === today?.getTime() + 24 * 60 * 60 * 1000) {
      return 'Tomorrow';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'scheduled':
        return 'text-primary bg-primary/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Upcoming Appointments</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} color="white" />
          </div>
          <h3 className="font-semibold text-card-foreground">Upcoming Appointments</h3>
        </div>
        <Link to="/appointment-booking">
          <Button variant="ghost" size="sm" iconName="Plus" iconSize={16}>
            Book New
          </Button>
        </Link>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={loadAppointments}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
      <div className="space-y-3">
        {appointments?.length > 0 ? (
          appointments?.map((appointment) => (
            <div
              key={appointment?.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                isToday(appointment?.appointment_date) ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-card-foreground">
                      {appointment?.appointment_type?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || 'Consultation'}
                    </h4>
                    {isToday(appointment?.appointment_date) && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} />
                      <span>{appointment?.therapist?.full_name || 'Dr. Anonymous'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} />
                      <span>
                        {formatAppointmentDate(appointment?.appointment_date)} at{' '}
                        {new Date(appointment?.appointment_date)?.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Timer" size={14} />
                      <span>{appointment?.duration_minutes || 50} minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment?.status)}`}>
                    {appointment?.status}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="xs" iconName="MessageCircle" iconSize={12}>
                      Chat
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="xs" 
                      iconName="X" 
                      iconSize={12}
                      onClick={() => handleCancelAppointment(appointment?.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
              
              {isToday(appointment?.appointment_date) && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Icon name="Clock" size={14} />
                      <span>Session starting soon</span>
                    </div>
                    <Button variant="default" size="sm" iconName="Video" iconSize={14}>
                      Join Session
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No upcoming appointments</p>
            <Link to="/appointment-booking">
              <Button variant="default" iconName="Plus" iconSize={16}>
                Schedule Your First Session
              </Button>
            </Link>
          </div>
        )}
      </div>
      {appointments?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {appointments?.length} upcoming appointment{appointments?.length !== 1 ? 's' : ''}
            </span>
            <Link to="/appointment-booking" className="text-primary hover:underline">
              View all appointments →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;