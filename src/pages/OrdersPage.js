import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'warning',
  processing: 'primary',
  confirmed: 'success',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'warning'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getAll();
        setOrders(data.orders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="orders-page">
      <div className="container-md" style={{ textAlign: 'center', paddingTop: 80 }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="container-md">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track all your secure transactions</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="order-meta">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.otpVerified && <span className="security-badge">🛡 2FA Verified</span>}
                  </div>
                  <div className="order-summary-right">
                    <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="expand-arrow">{expanded === order._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order._id && (
                  <div className="order-details">
                    <div className="order-items-list">
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'}
                            alt={item.name} className="order-item-thumb"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                          <div className="order-item-details">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-meta">${item.price?.toFixed(2)} × {item.quantity}</span>
                          </div>
                          <span className="order-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-breakdown">
                      <div className="breakdown-row"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                      <div className="breakdown-row"><span>Tax</span><span>${order.taxAmount?.toFixed(2)}</span></div>
                      <div className="breakdown-row"><span>Shipping</span><span>{order.shippingAmount === 0 ? 'FREE' : `$${order.shippingAmount?.toFixed(2)}`}</span></div>
                      <div className="breakdown-row total"><span>Total</span><span>${order.totalAmount?.toFixed(2)}</span></div>
                    </div>

                    {order.transaction && (
                      <div className="transaction-info">
                        <span className="t-label">Transaction</span>
                        <span className="t-token">{order.transaction.paymentToken || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
