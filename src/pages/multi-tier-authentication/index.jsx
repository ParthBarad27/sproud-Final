import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import components
import RoleSelectionCard from './components/RoleSelectionCard';
import ProgressIndicator from './components/ProgressIndicator';
import EmailVerificationForm from './components/EmailVerificationForm';
import DocumentUploadForm from './components/DocumentUploadForm';
import BiometricVerificationForm from './components/BiometricVerificationForm';
import TwoFactorAuthForm from './components/TwoFactorAuthForm';
import VerificationComplete from './components/VerificationComplete';

const MultiTierAuthentication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [verificationData, setVerificationData] = useState({});
  const { setSession, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Role Selection', subtitle: 'Choose your role' },
    { id: 2, title: 'Email Verification', subtitle: 'Verify email' },
    { id: 3, title: 'Document Upload', subtitle: 'Upload documents' },
    { id: 4, title: 'Biometric Scan', subtitle: 'Face verification' },
    { id: 5, title: 'Two-Factor Auth', subtitle: 'Enable 2FA' },
    { id: 6, title: 'Complete', subtitle: 'All done!' }
  ];

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleStepComplete = (stepData) => {
    setVerificationData(prev => ({ ...prev, ...stepData }));
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Welcome to MindBridge
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Secure multi-tier authentication system for mental health support platform. 
                Choose your role to begin the verification process.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {['student', 'consultant', 'faculty', 'admin']?.map((role) => (
                <RoleSelectionCard
                  key={role}
                  role={role}
                  isSelected={selectedRole === role}
                  onSelect={handleRoleSelection}
                />
              ))}
            </div>
            {selectedRole && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="default"
                  onClick={() => handleStepComplete({ role: selectedRole })}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="px-8"
                >
                  Continue with {selectedRole?.charAt(0)?.toUpperCase() + selectedRole?.slice(1)}
                </Button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <EmailVerificationForm
            onVerificationComplete={(data) => handleStepComplete({ email: data })}
            userRole={selectedRole}
          />
        );

      case 3:
        return (
          <DocumentUploadForm
            onUploadComplete={(data) => handleStepComplete({ documents: data })}
            userRole={selectedRole}
          />
        );

      case 4:
        return (
          <BiometricVerificationForm
            onVerificationComplete={(data) => handleStepComplete({ biometric: data })}
          />
        );

      case 5:
        return (
          <TwoFactorAuthForm
            onVerificationComplete={(data) => handleStepComplete({ twoFactor: data })}
            userEmail={verificationData?.email?.email}
            onSendOtp={() => sendOtp(verificationData?.email?.email)}
            onVerifyOtp={(code) => verifyOtp(code)}
          />
        );

      case 6:
        // set role + anonymous id in session and redirect to dashboard
        setSession({ selectedRole, email: verificationData?.email?.email });
        setTimeout(() => navigate('/student-dashboard'), 300);
        return (
          <VerificationComplete
            verificationData={verificationData}
            userRole={selectedRole}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Security Banner */}
          <div className="mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={24} className="text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-primary">Secure Verification Process</h2>
                  <p className="text-sm text-muted-foreground">
                    Your privacy and security are our top priorities. All data is encrypted and processed securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {currentStep > 1 && (
            <div className="mb-8">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={steps?.length}
                steps={steps}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>

          {/* Navigation Controls */}
          {currentStep > 1 && currentStep < 6 && (
            <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Previous Step
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {steps?.length}
              </div>
            </div>
          )}

          {/* Trust Signals */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  End-to-End Encryption
                </h3>
                <p className="text-sm text-muted-foreground">
                  All your data is encrypted using AES-256 encryption standards
                </p>
              </div>

              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="UserX" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Anonymous Identity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your identity is protected through our anonymous ID system
                </p>
              </div>

              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Award" size={24} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  GDPR Compliant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with Indian and international data protection laws
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Support */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <Icon name="AlertTriangle" size={32} className="text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you're experiencing a mental health crisis, don't wait for verification completion.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="destructive"
                  iconName="Phone"
                  iconPosition="left"
                >
                  Emergency Hotline
                </Button>
                <Button
                  variant="outline"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Crisis Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MultiTierAuthentication;