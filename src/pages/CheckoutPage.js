import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI, cartAPI } from '../services/api';
import './CheckoutPage.css';

const STEPS = ['Address', 'Payment', 'Security Check'];

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', cvv: '', paymentMethod: 'card' });
  const [biometric, setBiometric] = useState(false);
  const [riskInfo, setRiskInfo] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  const taxAmount = cartTotal * 0.08;
  const shippingAmount = cartTotal > 100 ? 0 : 9.99;
  const totalAmount = cartTotal + taxAmount + shippingAmount;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip) {
      return setError('Please fill all address fields');
    }
    setError('');
    setStep(1);
  };

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const validatedCart = await cartAPI.validate(cart.map(i => ({ productId: i.productId, quantity: i.quantity })));

      const orderData = await orderAPI.create({
        items: validatedCart.data.validatedItems,
        shippingAddress: address,
        paymentMethod: paymentInfo.paymentMethod
      });
      const order = orderData.data.order;
      setOrderId(order._id);

      const paymentData = await paymentAPI.initiate({
        orderId: order._id,
        cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''),
        cardHolderName: paymentInfo.cardHolderName,
        expiryMonth: paymentInfo.expiryMonth,
        expiryYear: paymentInfo.expiryYear,
        cvv: paymentInfo.cvv,
        biometricVerified: biometric
      });

      setTransactionId(paymentData.data.transactionId);
      setRiskInfo({ riskScore: paymentData.data.riskScore, maskedCard: paymentData.data.maskedCard });
      setDevOtp(paymentData.data.devOtp);
      setStep(2);

      navigate('/verify-otp', {
        state: {
          transactionId: paymentData.data.transactionId,
          maskedCard: paymentData.data.maskedCard,
          riskScore: paymentData.data.riskScore,
          amount: totalAmount,
          devOtp: paymentData.data.devOtp,
          orderId: order._id
        }
      });
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.riskScore !== undefined) {
        setError(`Transaction blocked: High fraud risk detected (Score: ${errData.riskScore}). Flags: ${errData.flags?.join(', ')}`);
      } else {
        setError(errData?.message || 'Failed to process payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Secure Checkout</h1>
        <p className="page-subtitle">Protected by Hybrid Security Model</p>

        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="step-indicator">
              {STEPS.map((s, i) => (
                <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                  <div className="step-num">{i < step ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            {step === 0 && (
              <div className="card step-card">
                <h2 className="step-title">📍 Shipping Address</h2>
                <form onSubmit={handleAddressSubmit}>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input type="text" className="form-input" placeholder="123 Main St"
                      value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" className="form-input" placeholder="New York"
                        value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" className="form-input" placeholder="NY"
                        value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">ZIP Code</label>
                      <input type="text" className="form-input" placeholder="10001"
                        value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input type="text" className="form-input" value={address.country}
                        onChange={e => setAddress({ ...address, country: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full">Continue to Payment →</button>
                </form>
              </div>
            )}

            {step === 1 && (
              <div className="card step-card">
                <h2 className="step-title">💳 Payment Details</h2>
                <div className="security-layer-info">
                  <div className="security-layer-badge">🔐 Hybrid Security Active</div>
                  <p>Your card data is tokenized and never stored</p>
                </div>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" className="form-input card-input" placeholder="4242 4242 4242 4242"
                      value={paymentInfo.cardNumber}
                      onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                      maxLength={19} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" className="form-input" placeholder="John Doe"
                      value={paymentInfo.cardHolderName}
                      onChange={e => setPaymentInfo({ ...paymentInfo, cardHolderName: e.target.value })} required />
                  </div>
                  <div className="form-row three-col">
                    <div className="form-group">
                      <label className="form-label">Month</label>
                      <input type="text" className="form-input" placeholder="MM"
                        value={paymentInfo.expiryMonth} maxLength={2}
                        onChange={e => setPaymentInfo({ ...paymentInfo, expiryMonth: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <input type="text" className="form-input" placeholder="YYYY"
                        value={paymentInfo.expiryYear} maxLength={4}
                        onChange={e => setPaymentInfo({ ...paymentInfo, expiryYear: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input type="password" className="form-input" placeholder="•••"
                        value={paymentInfo.cvv} maxLength={4}
                        onChange={e => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })} required />
                    </div>
                  </div>
                  <div className="biometric-option">
                    <label className="biometric-label">
                      <input type="checkbox" checked={biometric}
                        onChange={e => setBiometric(e.target.checked)} />
                      <span>🪪 Enable biometric verification (simulated)</span>
                    </label>
                  </div>
                  <div className="payment-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner" /> Processing...</> : `🔒 Pay $${totalAmount.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="card order-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="order-items">
                {cart.map(item => (
                  <div key={item.productId} className="order-item">
                    <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'}
                      alt={item.name} className="order-item-img"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">×{item.quantity}</span>
                    </div>
                    <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}</span></div>
              <div className="summary-divider" />
              <div className="summary-row summary-total"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
            </div>

            <div className="security-features">
              <h4>Security Features</h4>
              {[
                { icon: '🔒', label: 'SSL/TLS Encryption', desc: 'All data transmitted securely' },
                { icon: '🔐', label: 'Card Tokenization', desc: 'Card replaced with secure token' },
                { icon: '📱', label: 'OTP Verification', desc: '6-digit one-time password' },
                { icon: '🤖', label: 'AI Fraud Detection', desc: 'Real-time risk scoring' },
                { icon: '🏦', label: 'Bank Approval', desc: 'Live bank verification' }
              ].map(f => (
                <div key={f.label} className="security-feature-item">
                  <span className="security-feature-icon">{f.icon}</span>
                  <div>
                    <div className="security-feature-label">{f.label}</div>
                    <div className="security-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
