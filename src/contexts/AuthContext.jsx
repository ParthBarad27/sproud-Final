import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Simple in-memory OTP simulator and role/session management.

const AuthContext = createContext(null);

const ANON_ID_STORAGE_KEY = 'mindbridge_anon_id';
const ROLE_STORAGE_KEY = 'mindbridge_role';

function generateAnonymousId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timestamp = new Date().getFullYear().toString().slice(-2);
  return `MB${timestamp}-${random}`;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_STORAGE_KEY) || '');
  const [anonymousId, setAnonymousId] = useState(() => localStorage.getItem(ANON_ID_STORAGE_KEY) || '');
  const [pendingOtp, setPendingOtp] = useState('');
  const [otpSentTo, setOtpSentTo] = useState('');

  useEffect(() => {
    if (role) {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } else {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  }, [role]);

  useEffect(() => {
    if (anonymousId) {
      localStorage.setItem(ANON_ID_STORAGE_KEY, anonymousId);
    } else {
      localStorage.removeItem(ANON_ID_STORAGE_KEY);
    }
  }, [anonymousId]);

  const sendOtp = (destination) => {
    const code = generateOtp();
    setPendingOtp(code);
    setOtpSentTo(destination || '');
    // For demo: log to console so it can be "received" in prototype
    try { console.info('[MindBridge OTP]', code, '→', destination); } catch (_) {}
    return code;
  };

  const verifyOtp = (code) => {
    const ok = code && pendingOtp && code === pendingOtp;
    if (ok) setPendingOtp('');
    return ok;
  };

  const setSession = ({ selectedRole, email }) => {
    if (selectedRole) setRole(selectedRole);
    if (!anonymousId) setAnonymousId(generateAnonymousId());
    if (email) {
      // optionally bind anon id to email in-memory for demo
    }
  };

  const logout = () => {
    setRole('');
    setAnonymousId('');
    setPendingOtp('');
    setOtpSentTo('');
  };

  const value = useMemo(() => ({
    // session
    role,
    anonymousId,
    setRole,
    setAnonymousId,
    setSession,
    logout,
    // otp
    otpSentTo,
    sendOtp,
    verifyOtp,
  }), [role, anonymousId, otpSentTo]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});
