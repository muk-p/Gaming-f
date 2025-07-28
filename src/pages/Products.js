import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import ProductForm from '../components/products/ProductForm';
import ProductList from '../components/products/ProductList';
import SearchBar from '../components/products/SearchBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', actualPrice: '', stock: '', image: null });
  const [edit, setEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch {
      alert('Failed to load products');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      {user?.role === 'admin' && (
        <ProductForm
          form={form}
          setForm={setForm}
          preview={preview}
          setPreview={setPreview}
          fetchData={fetchData}
          edit={edit}
          setEdit={setEdit}
        />
      )}

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ProductList
        products={filtered}
        user={user}
        form={form}
        setForm={setForm}
        edit={edit}
        setEdit={setEdit}
        preview={preview}
        setPreview={setPreview}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Products;
