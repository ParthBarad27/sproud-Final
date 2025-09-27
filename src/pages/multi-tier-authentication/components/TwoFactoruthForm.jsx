import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TwoFactorAuthForm = ({ onVerificationComplete, userEmail }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [authMethod, setAuthMethod] = useState('sms'); // 'sms' or 'email'

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex?.test(phone)) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
    return null;
  };

  const handleSendOtp = async () => {
    if (authMethod === 'sms') {
      const phoneError = validatePhoneNumber(phoneNumber);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }
    }

    setErrors({});
    setIsVerifying(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsVerifying(false);
      setCountdown(60); // 60 seconds countdown
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
        onVerificationComplete({ 
          twoFactor: true, 
          verified: true,
          method: authMethod,
          contact: authMethod === 'sms' ? phoneNumber : userEmail
        });
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again or use 123456 for demo.' });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    
    setOtp('');
    setErrors({});
    handleSendOtp();
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method);
    setIsOtpSent(false);
    setOtp('');
    setErrors({});
    setCountdown(0);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>
      {/* Authentication Method Selection */}
      {!isOtpSent && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Choose verification method:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => switchAuthMethod('sms')}
              className={`p-4 rounded-lg border-2 transition-all ${
                authMethod === 'sms' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className={authMethod === 'sms' ? 'text-primary' : 'text-muted-foreground'} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${authMethod === 'sms' ? 'text-primary' : 'text-foreground'}`}>
                    SMS
                  </p>
                  <p className="text-xs text-muted-foreground">Mobile number</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => switchAuthMethod('email')}
              className={`p-4 rounded-lg border-2 transition-all ${
                authMethod === 'email' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className={authMethod === 'email' ? 'text-primary' : 'text-muted-foreground'} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${authMethod === 'email' ? 'text-primary' : 'text-foreground'}`}>
                    Email
                  </p>
                  <p className="text-xs text-muted-foreground">Email address</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {!isOtpSent ? (
        <div className="space-y-4">
          {authMethod === 'sms' ? (
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e?.target?.value?.replace(/\D/g, '')?.slice(0, 10))}
              error={errors?.phone}
              required
              maxLength={10}
              description="We'll send a 6-digit verification code to this number"
            />
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Address</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant="default"
            onClick={handleSendOtp}
            loading={isVerifying}
            disabled={authMethod === 'sms' && !phoneNumber}
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
                Verification code sent to {authMethod === 'sms' ? `+91 ${phoneNumber}` : userEmail}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please enter the 6-digit code below
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
              disabled={isVerifying || countdown > 0}
              iconName="RotateCcw"
              iconPosition="left"
            >
              {countdown > 0 ? `${countdown}s` : 'Resend'}
            </Button>
          </div>
        </div>
      )}
      {/* Security Features */}
      <div className="mt-6 space-y-3">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={14} className="text-success" />
            <p className="text-xs text-success font-medium">End-to-end encrypted</p>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Code expires in 10 minutes</p>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Your number/email is kept private and secure</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Why Two-Factor Authentication?</p>
            <p>2FA adds an extra layer of security by requiring both your password and a verification code, making your account significantly more secure against unauthorized access.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthForm;