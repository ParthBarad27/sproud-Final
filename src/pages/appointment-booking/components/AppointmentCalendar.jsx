import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentCalendar = ({ selectedConsultant, onTimeSlotSelect, selectedTimeSlot }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const timeSlots = [
    { time: '09:00 AM', available: true, type: 'individual' },
    { time: '10:00 AM', available: false, type: 'individual' },
    { time: '11:00 AM', available: true, type: 'group' },
    { time: '02:00 PM', available: true, type: 'individual' },
    { time: '03:00 PM', available: true, type: 'crisis' },
    { time: '04:00 PM', available: true, type: 'individual' },
    { time: '05:00 PM', available: false, type: 'individual' },
    { time: '06:00 PM', available: true, type: 'group' }
  ];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date?.toDateString() === today?.toDateString();
  };

  const isSameDay = (date1, date2) => {
    return date1 && date2 && date1?.toDateString() === date2?.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return date && date < today;
  };

  const getSessionTypeColor = (type) => {
    const colors = {
      individual: 'bg-primary text-primary-foreground',
      group: 'bg-secondary text-secondary-foreground',
      crisis: 'bg-destructive text-destructive-foreground'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  const getSessionTypeIcon = (type) => {
    const icons = {
      individual: 'User',
      group: 'Users',
      crisis: 'AlertTriangle'
    };
    return icons?.[type] || 'Clock';
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Select Date & Time
        </h3>
        {selectedConsultant && (
          <div className="text-sm text-muted-foreground">
            Booking with Dr. {selectedConsultant?.name}
          </div>
        )}
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronLeft"
          onClick={() => navigateMonth(-1)}
        />
        <h4 className="text-lg font-medium">
          {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronRight"
          onClick={() => navigateMonth(1)}
        />
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Day headers */}
        {dayNames?.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days?.map((day, index) => (
          <button
            key={index}
            onClick={() => day && !isPastDate(day) && setSelectedDate(day)}
            disabled={!day || isPastDate(day)}
            className={`p-2 text-sm rounded-md transition-colors duration-200 ${
              !day
                ? 'invisible'
                : isPastDate(day)
                ? 'text-muted-foreground cursor-not-allowed'
                : isSameDay(day, selectedDate)
                ? 'bg-primary text-primary-foreground'
                : isToday(day)
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-muted text-card-foreground'
            }`}
          >
            {day && day?.getDate()}
          </button>
        ))}
      </div>
      {/* Time Slots */}
      <div className="space-y-4">
        <h4 className="font-medium text-card-foreground">
          Available Time Slots - {selectedDate?.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeSlots?.map((slot, index) => (
            <button
              key={index}
              onClick={() => slot?.available && onTimeSlotSelect({ ...slot, date: selectedDate })}
              disabled={!slot?.available}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                selectedTimeSlot && selectedTimeSlot?.time === slot?.time
                  ? 'border-primary bg-primary text-primary-foreground'
                  : slot?.available
                  ? 'border-border hover:border-primary hover:bg-muted' :'border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Icon name={getSessionTypeIcon(slot?.type)} size={16} />
                <span>{slot?.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSessionTypeColor(slot?.type)}`}>
                  {slot?.type}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Session Type Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Individual Session</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>Group Session</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Crisis Intervention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;