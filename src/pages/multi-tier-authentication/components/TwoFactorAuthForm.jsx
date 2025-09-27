import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TwoFactorAuthForm = ({ userEmail, onSendOtp, onVerifyOtp, onVerificationComplete }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sent | verifying | success | error
  const [message, setMessage] = useState('');

  const handleSend = () => {
    try {
      onSendOtp?.();
      setStatus('sent');
      setMessage('OTP sent. Check console logs for demo code.');
    } catch (e) {
      setStatus('error');
      setMessage('Failed to send OTP.');
    }
  };

  const handleVerify = () => {
    if (!code) return;
    setStatus('verifying');
    const ok = onVerifyOtp?.(code);
    if (ok) {
      setStatus('success');
      setMessage('Verification successful.');
      onVerificationComplete?.({ method: 'otp', email: userEmail });
    } else {
      setStatus('error');
      setMessage('Invalid code. Try again.');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-1">Two-Factor Authentication</h2>
      <p className="text-sm text-muted-foreground mb-4">We will verify {userEmail || 'your email'} using a one-time code.</p>

      <div className="flex items-center space-x-2 mb-4">
        <Button variant="default" onClick={handleSend} iconName="Send" size="sm">
          Send OTP
        </Button>
        {status === 'sent' && (
          <div className="text-xs text-muted-foreground flex items-center space-x-1">
            <Icon name="Info" size={14} />
            <span>OTP sent (see console)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs text-muted-foreground mb-1">Enter 6-digit code</label>
          <input
            value={code}
            onChange={(e) => setCode(e?.target?.value)}
            maxLength={6}
            placeholder="123456"
            className="w-full px-3 py-2 bg-background border border-border rounded"
          />
        </div>
        <div>
          <Button variant="success" onClick={handleVerify} iconName="Check" fullWidth>
            Verify
          </Button>
        </div>
      </div>

      {message && (
        <div className={`mt-3 text-xs ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>{message}</div>
      )}
    </div>
  );
};

export default TwoFactorAuthForm;


