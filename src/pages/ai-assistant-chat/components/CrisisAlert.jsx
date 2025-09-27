import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CrisisAlert = ({ isVisible, onDismiss, onEmergencyContact, onCounselorRequest }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border-2 border-destructive rounded-lg shadow-2xl max-w-md w-full mx-4 animate-scale-up">
        {/* Header */}
        <div className="bg-destructive text-destructive-foreground p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Crisis Support Detected</h2>
              <p className="text-sm opacity-90">We're here to help you right now</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-foreground mb-4 leading-relaxed">
              I've detected that you might be going through a difficult time. Your safety and wellbeing are our top priority. 
              Please know that you're not alone, and help is available immediately.
            </p>
            
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Icon name="Heart" size={16} className="text-destructive mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Remember:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• This feeling is temporary</li>
                    <li>• You matter and your life has value</li>
                    <li>• Professional help is available 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="space-y-3">
            <Button
              variant="destructive"
              fullWidth
              iconName="Phone"
              iconPosition="left"
              onClick={onEmergencyContact}
              className="h-12 text-base font-medium"
            >
              Call Emergency Helpline
            </Button>

            <Button
              variant="secondary"
              fullWidth
              iconName="UserCheck"
              iconPosition="left"
              onClick={onCounselorRequest}
              className="h-12"
            >
              Connect with Crisis Counselor
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={16}
                className="h-10 text-sm"
              >
                Crisis Chat
              </Button>
              <Button
                variant="outline"
                iconName="MapPin"
                iconPosition="left"
                iconSize={16}
                className="h-10 text-sm"
              >
                Find Help Nearby
              </Button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium text-sm text-foreground mb-2 flex items-center">
              <Icon name="Shield" size={14} className="mr-2" />
              24/7 Crisis Helplines
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>National Crisis Helpline:</span>
                <span className="font-mono">1800-599-0019</span>
              </div>
              <div className="flex justify-between">
                <span>Student Crisis Support:</span>
                <span className="font-mono">1800-233-3330</span>
              </div>
            </div>
          </div>

          {/* Dismiss Option */}
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              fullWidth
              iconName="X"
              iconPosition="left"
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              I'm safe, continue conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;