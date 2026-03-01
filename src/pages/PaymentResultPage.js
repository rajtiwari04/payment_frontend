import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './PaymentResultPage.css';

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const { success, transaction, order, message } = state;

  if (!state.transaction && !state.message) {
    navigate('/');
    return null;
  }

  return (
    <div className="result-page">
      <div className="result-card">
        <div className={`result-icon-wrap ${success ? 'success' : 'failure'}`}>
          <div className="result-icon">{success ? '✓' : '✗'}</div>
          <div className="result-rings">
            <div className="ring" /><div className="ring" /><div className="ring" />
          </div>
        </div>

        <h1 className={`result-title ${success ? 'success' : 'failure'}`}>
          {success ? 'Payment Successful!' : 'Payment Failed'}
        </h1>
        <p className="result-message">{message}</p>

        {transaction && (
          <div className="transaction-details">
            <h3>Transaction Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`detail-value badge ${success ? 'badge-success' : 'badge-danger'}`}>
                  {transaction.status?.toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount</span>
                <span className="detail-value">${transaction.amount?.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Card</span>
                <span className="detail-value">{transaction.maskedCard}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Payment Token</span>
                <span className="detail-value mono">{transaction.paymentToken?.slice(0, 20)}...</span>
              </div>
              {transaction.gatewayTransactionId && (
                <div className="detail-item">
                  <span className="detail-label">Gateway ID</span>
                  <span className="detail-value mono">{transaction.gatewayTransactionId}</span>
                </div>
              )}
              {transaction.bankTransactionId && (
                <div className="detail-item">
                  <span className="detail-label">Bank Ref</span>
                  <span className="detail-value mono">{transaction.bankTransactionId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="security-verified">
            <h3>Security Verification Complete</h3>
            <div className="verification-steps">
              {[
                { label: 'SSL/TLS Encryption', icon: '🔒', done: true },
                { label: 'Card Tokenization', icon: '🔐', done: true },
                { label: 'OTP Verified', icon: '📱', done: true },
                { label: 'Fraud Check Passed', icon: '🤖', done: true },
                { label: 'Bank Approved', icon: '🏦', done: true }
              ].map(step => (
                <div key={step.label} className="verification-step">
                  <span className="v-icon">{step.icon}</span>
                  <span className="v-label">{step.label}</span>
                  <span className="v-check">✓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
          <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
