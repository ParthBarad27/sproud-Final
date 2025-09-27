import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationComplete = ({ verificationData, userRole }) => {
  const [anonymousId, setAnonymousId] = useState('');
  const [isGeneratingId, setIsGeneratingId] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate anonymous ID
    setTimeout(() => {
      const id = `MB${userRole?.toUpperCase()?.slice(0, 3)}${Date.now()?.toString()?.slice(-6)}`;
      setAnonymousId(id);
      setIsGeneratingId(false);
    }, 2000);
  }, [userRole]);

  const handleContinue = () => {
    // Store verification data in localStorage for demo
    localStorage.setItem('userVerified', 'true');
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('anonymousId', anonymousId);
    
    // Navigate to appropriate dashboard
    switch (userRole) {
      case 'student': navigate('/student-dashboard');
        break;
      case 'consultant': navigate('/consultant-dashboard');
        break;
      case 'faculty': navigate('/faculty-dashboard');
        break;
      case 'admin': navigate('/admin-dashboard');
        break;
      default:
        navigate('/student-dashboard');
    }
  };

  const roleConfig = {
    student: {
      icon: 'GraduationCap',
      title: 'Student Verification Complete',
      description: 'Welcome to MindBridge! Your student account has been successfully verified.',
      features: ['Anonymous counseling sessions', 'AI mental health assistant', 'Peer support groups', 'Resource library access'],
      color: 'primary'
    },
    consultant: {
      icon: 'UserCheck',
      title: 'Consultant Verification Complete',
      description: 'Welcome to MindBridge! Your professional credentials have been verified.',
      features: ['Student case management', 'Session scheduling', 'Crisis intervention tools', 'Professional resources'],
      color: 'secondary'
    },
    faculty: {
      icon: 'Users',
      title: 'Faculty Verification Complete',
      description: 'Welcome to MindBridge! Your faculty account has been activated.',
      features: ['Student wellness monitoring', 'Early warning system', 'Referral management', 'Campus analytics'],
      color: 'accent'
    },
    admin: {
      icon: 'Shield',
      title: 'Administrator Verification Complete',
      description: 'Welcome to MindBridge! Your administrative access has been granted.',
      features: ['Institution analytics', 'User management', 'Policy configuration', 'Compliance monitoring'],
      color: 'warning'
    }
  };

  const config = roleConfig?.[userRole] || roleConfig?.student;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className={`w-24 h-24 bg-${config?.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
            <Icon name="CheckCircle" size={48} color="white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">{config?.title}</h1>
        <p className="text-muted-foreground">{config?.description}</p>
      </div>
      {/* Verification Summary */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Verification Summary</h3>
        
        <div className="space-y-4">
          {/* Email Verification */}
          {verificationData?.email && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Verified</p>
                  <p className="text-xs text-muted-foreground">{verificationData?.email?.email}</p>
                </div>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          )}

          {/* Document Verification */}
          {verificationData?.documents && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={20} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Documents Verified</p>
                  <p className="text-xs text-muted-foreground">
                    {verificationData?.documents?.documents?.length || 0} documents processed
                  </p>
                </div>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          )}

          {/* Biometric Verification */}
          {verificationData?.biometric && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Scan" size={20} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Biometric Verified</p>
                  <p className="text-xs text-muted-foreground">
                    Confidence: {((verificationData?.biometric?.confidence || 0.95) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          )}

          {/* Two-Factor Authentication */}
          {verificationData?.twoFactor && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">2FA Enabled</p>
                  <p className="text-xs text-muted-foreground">
                    Method: {verificationData?.twoFactor?.method?.toUpperCase() || 'SMS'}
                  </p>
                </div>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          )}
        </div>
      </div>
      {/* Anonymous ID Generation */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="UserX" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Anonymous Identity</h3>
        </div>
        
        {isGeneratingId ? (
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Generating Anonymous ID...</p>
              <p className="text-xs text-muted-foreground">Creating secure identity for privacy protection</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Your Anonymous ID</p>
                <p className="text-2xl font-mono font-bold text-primary mt-1">{anonymousId}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This ID protects your privacy while accessing services
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Copy"
                iconSize={16}
                className="text-primary"
                onClick={() => navigator.clipboard?.writeText(anonymousId)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Available Features */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Available Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Icon name="Check" size={16} className="text-success" />
              <p className="text-sm text-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Lock" size={20} className="text-muted-foreground mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Privacy & Security</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Your identity is protected through anonymous ID system</li>
              <li>• All communications are end-to-end encrypted</li>
              <li>• Personal data is stored securely and never shared</li>
              <li>• You can delete your account and data at any time</li>
              <li>• Compliance with GDPR and Indian data protection laws</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={handleContinue}
          disabled={isGeneratingId}
          iconName="ArrowRight"
          iconPosition="right"
          className="flex-1"
        >
          Continue to Dashboard
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.print()}
          iconName="Download"
          iconPosition="left"
        >
          Save Summary
        </Button>
      </div>
      {/* Support Contact */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Need help or have questions about your verification?
        </p>
        <Button
          variant="link"
          iconName="MessageCircle"
          iconPosition="left"
          className="text-primary"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default VerificationComplete;