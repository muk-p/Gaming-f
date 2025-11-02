import { useState, useEffect, useContext } from 'react';
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

  const [modals, setModals] = useState({ login: false, cart: false, tab: false });
  const [form, setForm] = useState({ email: '', password: '' });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  // ✅ Load local JSON data instead of API
  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => alert('Could not load products'));
  }, []);

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  useEffect(() => {
    const lock = modals.login || modals.cart || modals.tab;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [modals]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

// Mock login
const handleLogin = (e) => {
  e.preventDefault();

  // Example static user
  const validUser = {
    email: "user@example.com",
    password: "123456",
    token: "mock-token-12345",
  };

  // Basic validation
  if (form.email === validUser.email && form.password === validUser.password) {
    login(validUser.email, validUser.password);

    setModals({ login: false, cart: false, tab: true });
    setForm({ email: "", password: "" });
    showAlert("Login successful");
  } else {
    alert("Invalid email or password (try user@example.com / 123456)");
  }
};

  const handleAddToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
    showAlert('Added to cart');
    setModals(prev => ({ ...prev, cart: false }));
  };

  const handleRemove = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((sum, i) => sum + i.qty * i.actualPrice, 0);

  const showAlert = (message) => {
    const el = document.createElement('div');
    el.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow z-50';
    el.innerText = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Navbar
        searchTerm={search}
        setSearchTerm={setSearch}
        filteredProducts={filteredProducts}
        toggleLogin={() => setModals(prev => ({ ...prev, login: true }))}
        toggleCart={() => setModals(prev => ({ ...prev, cart: true }))}
        cartLength={cart.length}
      />

      {modals.login && (
        <Modal>
          <LoginForm
            email={form.email}
            setEmail={v => setForm(f => ({ ...f, email: v }))}
            password={form.password}
            setPassword={v => setForm(f => ({ ...f, password: v }))}
            onClose={() => setModals(prev => ({ ...prev, login: false }))}
            onSubmit={handleLogin}
          />
        </Modal>
      )}

      {modals.tab && <NavigationTab navigate={navigate} close={() => setModals(prev => ({ ...prev, tab: false }))} />}

      {modals.cart && (
        <Modal>
          <CartOverlay
            cart={cart}
            total={total}
            onRemove={handleRemove}
            onClose={() => setModals(prev => ({ ...prev, cart: false }))}
          />
        </Modal>
      )}

      {/* HERO */}
      <div className="pt-[80px]">
        <section className="relative flex flex-col md:flex-row items-center justify-between pt-24 pb-12 bg-gray-900 text-white">
          <img
            src="https://images.unsplash.com/photo-1604846887565-640d2f52d564?q=80"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/30 to-gray-900/80" />
          <div className="relative z-10 px-6 md:w-1/2 space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold">Level-Up Your Gaming Experience</h1>
            <p className="text-lg text-gray-300">Latest gear, unbeatable deals & fast delivery in one place.</p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white transition"
            >
              Shop Now
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1705910308295-439693a18f50?q=80"
            alt="Setup"
            className="relative z-10 w-full md:w-1/2 max-h-80 object-cover rounded-xl mt-8 md:mt-0"
          />
        </section>
      </div>

      {/* PRODUCTS */}
      <div id="products" className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Available Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </div>

      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p className="text-sm text-gray-600">&copy; 2025 Gaming Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
    {children}
  </div>
);

export default LoginPage;
