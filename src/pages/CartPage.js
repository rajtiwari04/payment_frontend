import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const taxAmount = cartTotal * 0.08;
  const shippingAmount = cartTotal > 100 ? 0 : 9.99;
  const totalAmount = cartTotal + taxAmount + shippingAmount;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container-md">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={item.name}
                  className="cart-item-image"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>✕</button>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
          </div>

          <div className="cart-summary">
            <div className="card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax (8%)</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shippingAmount === 0 ? 'FREE' : `$${shippingAmount.toFixed(2)}`}</span></div>
              {shippingAmount === 0 && <div className="free-shipping-badge">🎉 Free shipping on orders over $100!</div>}
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
                🔒 Secure Checkout
              </button>
              <div className="checkout-badges">
                <span className="security-badge">🔒 SSL</span>
                <span className="security-badge">🛡 2FA</span>
                <span className="security-badge">🔐 Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
