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
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [username, setUsername] = useState('');
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

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/products', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
      .then(res => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (showLogin || showCart || showTab) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [showLogin, showCart, showTab]);

const filteredProducts = Array.isArray(products)
  ? products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { username, password });
      login(res.data.token);
      setShowLogin(false);
      setUsername('');
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
    alertBox.className = 'custom-alert';
    alertBox.innerHTML = `<div>${message}</div><div class="progress-bar" id="alert-progress"></div>`;
    document.body.appendChild(alertBox);
    const progress = alertBox.querySelector('#alert-progress');
    setTimeout(() => {
      progress.style.transition = `width ${duration}ms linear`;
      progress.style.width = '100%';
    }, 10);
    setTimeout(() => {
      alertBox.remove();
    }, duration);
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
  <Navbar
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    filteredProducts={filteredProducts}
    toggleLogin={() => setShowLogin(!showLogin)}
    toggleCart={() => setShowCart(!showCart)}
    cartLength={cart.length}
  />

  {showLogin && (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onClose={() => setShowLogin(false)}
      onSubmit={handleSubmit}
    />
  )}

  {showTab && <NavigationTab navigate={navigate} close={() => setShowTab(false)} />}

  {showCart && (
    <CartOverlay
      cart={cart}
      total={total}
      onRemove={handleRemove}
      onClose={() => setShowCart(false)}
    />
  )}

  <div className="hero-section  flex flex-col md:flex-row items-center justify-between pt-20 pb-6 bg-[url('https://images.unsplash.com/photo-1705910308295-439693a18f50?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
   bg-cover bg-center dark:bg-gray-800 shadow-md">
    <div className="text mb-4 md:mb-0">
      <h1 className="text-3xl text-grey md:text-4xl font-bold mb-2">Welcome to the Gaming Store</h1>
      <p className="text-lg text-grey dark:text-gray-300">
        Your one-stop shop for all gaming needs
      </p>
    </div>
    <img
      src="https://images.unsplash.com/photo-1604846887565-640d2f52d564?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="A modern gaming setup."
      className="w-full md:w-1/2 h-64 object-cover rounded-md shadow"
    />
  </div>

  <div className="products-container px-6 py-8 flex-1">
    <h2 className="text-2xl font-semibold mb-6">Available Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => {
            handleBuy(product);
            customAlert('Product added to cart', 2000);
          }}
        />
      ))}
    </div>
  </div>

  <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4 mt-8 shadow-inner">
    <p className="text-sm text-gray-700 dark:text-gray-400">
      &copy; 2023 Gaming Store. All rights reserved.
    </p>
  </footer>
</div>

  );
};

export default LoginPage;
