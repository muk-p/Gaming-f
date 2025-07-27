import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/login/Navbar';
import LoginForm from '../components/login/LoginForm';
import CartOverlay from '../components/login/CartOverlay';
import NavigationTab from '../components/login/NavigationTab';
import ProductCard from '../components/login/ProductCard';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const shouldLockScroll = showLogin || showCart || showTab;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [showLogin, showCart, showTab]);

  const filteredProducts = Array.isArray(products)
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      login(res.data.token);
      setShowLogin(false);
      setEmail('');
      setPassword('');
      setShowTab(true);
    } catch {
      alert('Login failed');
    }
  };

  const handleBuy = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
    setShowCart(false);
  };

  const handleRemove = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const customAlert = (message, duration = 2000) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fadeIn';
    alertBox.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(alertBox);
    setTimeout(() => {
      alertBox.classList.add('opacity-0');
      setTimeout(() => alertBox.remove(), 300);
    }, duration);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredProducts={filteredProducts}
        toggleLogin={() => setShowLogin(true)}
        toggleCart={() => setShowCart(true)}
        cartLength={cart.length}
      />

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onClose={() => setShowLogin(false)}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {showTab && (
        <NavigationTab
          navigate={navigate}
          close={() => setShowTab(false)}
        />
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <CartOverlay
            cart={cart}
            total={total}
            onRemove={handleRemove}
            onClose={() => setShowCart(false)}
          />
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-24 pb-10 overflow-hidden bg-gray-900 text-white">
        {/* Background */}
        <img
          src="https://images.unsplash.com/photo-1604846887565-640d2f52d564?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Gaming background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/20 to-gray-900/90" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 md:w-1/2 space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Level-Up&nbsp;Your&nbsp;Gaming&nbsp;Experience
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-md">
            Discover the latest gear, unbeatable deals and lightning‑fast delivery — all in one place.
          </p>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Hero Image */}
        <img
          src="https://images.unsplash.com/photo-1705910308295-439693a18f50?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Gaming setup"
          className="relative z-10 w-full md:w-1/2 max-h-80 object-cover rounded-xl shadow-2xl mt-8 md:mt-0"
        />
      </section>

      {/* PRODUCTS */}
      <div id="products" className="products-container px-6 py-8 flex-1">
        <h2 className="text-2xl font-semibold mb-6">Available Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => {
                handleBuy(product);
                customAlert('Product added to cart');
              }}
            />
          ))}
        </div>
      </div>

      <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4 mt-8 shadow-inner">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          &copy; 2025 Gaming Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
