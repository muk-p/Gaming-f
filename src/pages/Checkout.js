import React,{useState} from "react";
import axios from "axios"; 

const CheckoutPage= () =>{
  const [phone, setPhone]=useState("");
  const [amount, setAmount]=useState("");
  const [loading, setLoading]=useState(false);
  const [message, setMessage]=useState("");

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try{
      const res = await axios.post ('https://mpesa-checkout1.onrender.com/pay',{
        phone,
        amount,
      });
      const { ResponseDescription } = res.data;
      setMessage(ResponseDescription || "STK Push sent. Check your phone.");
      customAlert("STK Push sent. Check your phone.");
    } catch (err){
      const errorMsg = err.response?.data?.error || "Payment failed. Try again.";
      setMessage(errorMsg);
      console.log("Error:", errorMsg);
      customAlert("Payment failed. Try again.");
    }
  };


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
    alert(message);
    setPhone("");
    setAmount("");
    setLoading(false);
  };


  return(
    <div className="max-auto flex items-center justify-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="max-w-sm rounded-2xl shadow-md overflow-hidden bg-white p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">M-Pesa Checkout {message}</h2>
        <img className="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60" alt="Product"/>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Product Name</h2>
          <p className="text-gray-700">Product Description</p>
        </div>
        <input type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required 
          className="w-full p-2 border border-gray-300 rounded mb-4" placeholder="2547XXXXXXX" />
        <input type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required 
          className="w-full p-2 border border-gray-300 rounded mb-4" placeholder="Amount to pay" />
        <button type="submit"
          disabled={loading} 
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300">
            {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
      </form>
    </div>
  )
};

export default CheckoutPage;