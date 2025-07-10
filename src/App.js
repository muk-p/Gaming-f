import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Products from './pages/Products';
import Sales from './pages/Sales';


function App() {
  return (
  <AuthProvider>
    <Router>    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </Router>
     </AuthProvider>
  );
}

export default App;

