import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"; // Assuming AuthContext provides cart

const CheckoutPage = () => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { cart, total } = useContext(AuthContext); // Assuming cart and total are in AuthContext

  // Fallback to localStorage if AuthContext doesn't provide cart
  const [localCart, setLocalCart] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);

  useEffect(() => {
    if (cart && total) {
      setAmount(total);
    } else {
      // Fallback to localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const storedTotal = storedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
      setLocalCart(storedCart);
      setLocalTotal(storedTotal);
      setAmount(storedTotal);
    }
  }, [cart, total]);

  const currentCart = cart || localCart;
  const currentTotal = total || localTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post('https://mpesa-checkout1.onrender.com/pay', {
        phone,
        amount,
      });
      const { ResponseDescription } = res.data;
      setMessage(ResponseDescription || "STK Push sent. Check your phone.");
      customAlert("STK Push sent. Check your phone.");
      // Clear cart after successful payment attempt
      if (cart && total) {
        // Assuming a function like clearCart exists in AuthContext
        // clearCart();
      } else {
        localStorage.removeItem("cart");
        setLocalCart([]);
        setLocalTotal(0);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Payment failed. Try again.";
      setMessage(errorMsg);
      console.log("Error:", errorMsg);
      customAlert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const customAlert = (messageText, duration = 3000) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.innerHTML = `<div>${messageText}</div><div class="progress-bar" id="alert-progress"></div>`;
    document.body.appendChild(alertBox);
    const progress = alertBox.querySelector('#alert-progress');
    setTimeout(() => {
      progress.style.transition = `width ${duration}ms linear`;
      progress.style.width = '100%';
    }, 10);
    setTimeout(() => {
      alertBox.remove();
    }, duration);
    // Keep original alert for now, can be removed if customAlert is styled well
    alert(messageText);
    setPhone("");
    // setAmount(""); // Amount should remain as the cart total
  };

  return (
    <div className="max-auto flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="max-w-lg w-full rounded-2xl shadow-md overflow-hidden bg-white p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout {message && <span className="text-sm text-red-500">- {message}</span>}</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          {currentCart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto mb-4 border-b pb-3">
              {currentCart.map(item => (
                <li
                  key={item.id || item.product_id} // Use product_id if id is not available
                  className="flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.qty || item.quantity} × KES {item.price}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">KES {(item.qty || item.quantity) * item.price}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total Amount:</span>
            <span>KES {currentTotal.toFixed(2)}</span>
          </div>
        </div>

        <img className="w-full h-48 object-cover my-4 rounded" src=
            {https://back-gf-production.up.railway.app/api/uploads/${product.imageFile}} alt="Checkout Visual"/>

        <div className="mt-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="2547XXXXXXX"
          />
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
          <input
            type="number"
            id="amount"
            value={amount}
            readOnly // Amount should be derived from cart total
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-50 shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Amount to pay"
          />
          <button
            type="submit"
            disabled={loading || currentCart.length === 0}
            className={`w-full text-white p-2 rounded transition duration-300 ${loading || currentCart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {loading ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
