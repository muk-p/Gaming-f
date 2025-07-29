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
  const { user } = useContext(AuthContext);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch {
      alert('Failed to load products');
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get('/sales');
      const recentSales = res.data.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= thirtyDaysAgo;
      });
      setSales(recentSales);
    } catch {
      alert('Failed to load sales');
    }
  };

  const recordSale = async () => {
    try {
      if (!selected || quantity <= 0) return alert('Invalid entry');
      await axios.post('/sales', { productId: selected, quantity });
      alert('Sale recorded');
      fetchSales();
    } catch {
      alert('Failed to record sale');
    }
  };

  const buildReport = () => {
    const breakdown = {};
    const daily = {};

    for (const sale of sales) {
      const name = sale.Product?.name || 'Unknown';
      const dateKey = new Date(sale.createdAt).toISOString().split('T')[0];
      const revenue = Number(sale.totalPrice || 0);
      const qty = Number(sale.quantity || 0);

      // Breakdown by product
      if (!breakdown[name]) {
        breakdown[name] = { total_quantity: 0, total_revenue: 0 };
      }
      breakdown[name].total_quantity += qty;
      breakdown[name].total_revenue += revenue;

      // Daily sales
      if (!daily[dateKey]) {
        daily[dateKey] = 0;
      }
      daily[dateKey] += revenue;
    }

    return {
      breakdown: Object.entries(breakdown).map(([product_name, data]) => ({
        product_name,
        ...data,
      })),
      daily: Object.entries(daily).map(([date, total_sales]) => ({
        date,
        total_sales,
      })).sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  };

  const report = user?.role === 'admin' ? buildReport() : null;

  const totalSales = report?.breakdown.reduce((sum, item) => sum + item.total_revenue, 0) || 0;

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin' && report?.daily && chartRef.current) {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
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
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }, [report]);

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

      <h2 className="text-2xl font-semibold mb-4">Recent Sales (Last 30 Days)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Product Name</th>
              <th className="border px-4 py-2 text-left">Quantity</th>
              <th className="border px-4 py-2 text-left">Total Price</th>
              <th className="border px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{sale.Product?.name || '—'}</td>
                <td className="border px-4 py-2">{sale.quantity} pcs</td>
                <td className="border px-4 py-2">KES {Number(sale.totalPrice).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(sale.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role === 'admin' && report && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Sales Report (Admin Only)</h2>
          <p className="mb-2 text-lg">
            Total Sales: <strong>KES {Number(totalSales).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</strong>
          </p>

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
