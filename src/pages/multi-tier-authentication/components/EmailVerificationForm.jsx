import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmailVerificationForm = ({ onVerificationComplete, userRole }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test(email)) {
      return 'Please enter a valid email address';
    }
    
    if (userRole === 'student' && !email?.endsWith('.edu')) {
      return 'Student email must be from a college domain (.edu)';
    }
    
    return null;
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    setIsVerifying(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsVerifying(false);
    }, 2000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp?.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setErrors({});
    setIsVerifying(true);

    // Mock OTP verification
    setTimeout(() => {
      if (otp === '123456') {
        onVerificationComplete({ email, verified: true });
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again or use 123456 for demo.' });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    setOtp('');
    setErrors({});
    handleSendOtp();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Mail" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Email Verification</h3>
          <p className="text-sm text-muted-foreground">
            {userRole === 'student' ?'Enter your college email address to receive verification code' :'Enter your professional email address for verification'
            }
          </p>
        </div>
      </div>
      {!isOtpSent ? (
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder={userRole === 'student' ? 'student@college.edu' : 'professional@domain.com'}
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            error={errors?.email}
            required
            description={userRole === 'student' ? 'Must be a valid college email ending with .edu' : 'Your professional email address'}
          />
          
          <Button
            variant="default"
            onClick={handleSendOtp}
            loading={isVerifying}
            disabled={!email}
            iconName="Send"
            iconPosition="right"
            className="w-full"
          >
            Send Verification Code
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <p className="text-sm text-success font-medium">
                Verification code sent to {email}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your email and enter the 6-digit code below
            </p>
          </div>

          <Input
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
            error={errors?.otp}
            required
            maxLength={6}
            description="Demo code: 123456"
          />

          <div className="flex space-x-3">
            <Button
              variant="default"
              onClick={handleVerifyOtp}
              loading={isVerifying}
              disabled={!otp || otp?.length !== 6}
              iconName="Shield"
              iconPosition="right"
              className="flex-1"
            >
              Verify Code
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={isVerifying}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Resend
            </Button>
          </div>
        </div>
      )}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Security Notice:</p>
            <p>Your email will be used for account recovery and important notifications. We use end-to-end encryption to protect your privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;