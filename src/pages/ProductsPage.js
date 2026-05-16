import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'];

const CATEGORY_IMAGES = {
  Electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  ],
  Books: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  ],
  Home: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aaa4fce1?w=400&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
    'https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?w=400&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
  ],
  Toys: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
  ],
  Other: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
  ],
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';

function getProductImage(product) {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  const pool = CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES['Other'];
  const seed = (product._id || product.name || '').split('').reduce(function(acc, ch) { return acc + ch.charCodeAt(0); }, 0);
  return pool[seed % pool.length];
}

const ProductCard = ({ product, onAddToCart }) => {
  const [imgSrc, setImgSrc] = useState(function() { return getProductImage(product); });
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="product-card">
      <div className="product-image-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        {!imgLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #1e1e3a 25%, #2a2a4a 50%, #1e1e3a 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear',
              zIndex: 1,
            }}
          />
        )}
        <img
          src={imgSrc}
          alt={product.name}
          className="product-image"
          loading="lazy"
          decoding="async"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <span className="product-category-badge">{product.category}</span>
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="product-stock">
            {product.stock > 0
              ? <span className="in-stock">● {product.stock} left</span>
              : <span className="out-stock">Out of stock</span>}
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [notification, setNotification] = useState('');
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="products-page">
      <style>{`@keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}</style>
      {notification && (
        <div className="cart-notification">✓ {notification}</div>
      )}
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="page-title">Shop</h1>
            <p className="page-subtitle">Browse our secure marketplace</p>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? 'active' : ''}`}
              onClick={() => { setCategory(cat); setPage(1); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="pagination">
                <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="page-info">Page {page} of {pagination.pages}</span>
                <button className="btn btn-secondary btn-sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
