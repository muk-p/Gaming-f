// File: frontend/src/pages/Sales.js
import { useEffect, useState, useContext, useRef } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import Chart from 'chart.js/auto';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selected, setSelected] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [report, setReport] = useState(null);
  const { user } = useContext(AuthContext);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      alert('Failed to load products');
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get('/sales');
      setSales(res.data);
    } catch (err) {
      alert('Failed to load sales');
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get('/sales/report');
      setReport(res.data);
    } catch (err) {
      alert('Failed to load sales report');
    }
  };

  const recordSale = async () => {
    try {
      if (!selected || quantity <= 0) return alert('Invalid entry');
      await axios.post('/sales', { productId: selected, quantity });
      alert('Sale recorded');
      fetchSales();
      if (user?.role === 'admin') fetchReport();
    } catch (err) {
      alert('Failed to record sale');
    }
  };

  // Calculate total sales from the report data if available, otherwise from sales list (less accurate)
  const calculateTotalSales = () => {
    if (report && report.breakdown) {
      return report.breakdown.reduce((sum, item) => sum + Number(item.total_revenue || 0), 0);
    }
    // Fallback: This might be inaccurate if 'sales' items don't have price or if revenue means something else.
    // It's better to rely on the aggregated report.
    // For individual sales, we'd need product price at the time of sale.
    // The existing 'sales' array seems to lack individual revenue or price.
    // The original `totalSales` was: sales.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
    // This implies 'sales' items might have a 'revenue' field from the backend.
    // If sales items are guaranteed to have a 'revenue' field:
    return sales.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
    // If not, and we must calculate from sales:
    // This would require sales items to have price and quantity, e.g., item.price * item.quantity
    // return sales.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  };

  const totalSales = calculateTotalSales();


  useEffect(() => {
    fetchProducts();
    fetchSales();
    if (user?.role === 'admin') fetchReport();
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'admin' && report?.daily && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: report.daily.map(d => d.date),
          datasets: [{
            label: 'Daily Sales (KES)',
            data: report.daily.map(d => d.total_sales),
            borderColor: 'green',
            backgroundColor: 'rgba(0,128,0,0.1)',
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [report, user?.role]);

  return (
    <div className="p-4 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Sales Records</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select onChange={e => setSelected(e.target.value)} className="border p-2 rounded shadow">
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="border p-2 rounded w-24 shadow"
          min="1"
        />
        <button onClick={recordSale} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Record Sale
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Sales</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Product Name</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{sale.product_name}</td>
                <td className="border px-4 py-2">{sale.quantity} pcs</td>
                <td className="border px-4 py-2">{new Date(sale.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role === 'admin' && report && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Sales Report (Admin Only)</h2>
          <p className="mb-2 text-lg">Total Sales: <strong>KES {Number(totalSales).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</strong></p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Quantity Sold</th>
                  <th className="p-2 border">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {report.breakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{item.product_name}</td>
                    <td className="p-2 border">{item.total_quantity}</td>
                    <td className="p-2 border">KES {Number(item.total_revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Daily Sales Trend</h3>
            <canvas ref={chartRef} id='daily-sales-chart' width="300" height="150"></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
