import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './OTPVerifyPage.css';

const OTPVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const state = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    if (!state.transactionId) navigate('/cart');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setError('OTP expired. Please restart checkout.'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleOtpChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (value && idx < 5) inputs.current[idx + 1]?.focus();
    if (!value && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === 'Enter') handleSubmit();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return setError('Please enter the complete 6-digit OTP');
    setError('');
    setLoading(true);
    try {
      const { data } = await paymentAPI.verifyOTP({ transactionId: state.transactionId, otp: otpCode });
      clearCart();
      navigate('/payment-result', {
        state: {
          success: data.success,
          transaction: data.transaction,
          order: data.order,
          message: data.message
        }
      });
    } catch (err) {
      const errData = err.response?.data;
      setError(errData?.message || 'OTP verification failed');
      if (errData?.attemptsLeft !== undefined) {
        setError(`${errData.message} (${errData.attemptsLeft} attempts left)`);
      }
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-header">
          <div className="otp-shield">🔐</div>
          <h1 className="otp-title">Verify Transaction</h1>
          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to your registered email/phone
          </p>
        </div>

        <div className="otp-transaction-info">
          <div className="otp-info-row">
            <span>Card</span>
            <span>{state.maskedCard || '**** **** **** ****'}</span>
          </div>
          <div className="otp-info-row">
            <span>Amount</span>
            <span>${state.amount?.toFixed(2)}</span>
          </div>
          {state.riskScore !== undefined && (
            <div className="otp-info-row">
              <span>Risk Score</span>
              <span className={`risk-badge ${state.riskScore === 0 ? 'low' : state.riskScore === 1 ? 'medium' : 'high'}`}>
                {state.riskScore}/3 — {state.riskScore === 0 ? 'Low' : state.riskScore === 1 ? 'Medium' : 'High'} Risk
              </span>
            </div>
          )}
        </div>

        {state.devOtp && (
          <div className="dev-otp-notice">
            🚧 Dev Mode OTP: <strong>{state.devOtp}</strong>
          </div>
        )}

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <div className="otp-input-group" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputs.current[idx] = el}
              type="text"
              inputMode="numeric"
              className={`otp-input ${digit ? 'filled' : ''}`}
              value={digit}
              onChange={e => handleOtpChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              maxLength={1}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="otp-timer">
          {timeLeft > 0 ? (
            <span>⏱ Expires in <strong>{formatTime(timeLeft)}</strong></span>
          ) : (
            <span className="expired">OTP Expired</span>
          )}
        </div>

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleSubmit}
          disabled={loading || timeLeft === 0 || otp.join('').length !== 6}
        >
          {loading ? <><span className="spinner" /> Verifying...</> : '✓ Verify & Complete Payment'}
        </button>

        <button
          className="btn btn-secondary btn-full"
          style={{ marginTop: 12 }}
          onClick={() => navigate('/checkout')}
          disabled={loading}
        >
          ← Back to Checkout
        </button>

        <div className="otp-security-note">
          <span>🔒</span>
          <p>This transaction is protected by OTP/2FA, AI fraud detection, and real-time bank verification.</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
