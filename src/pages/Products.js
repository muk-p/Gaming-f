import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    actualPrice:'',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useContext(AuthContext);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    actualPrice:'',
    stock: '',
    image: null,
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      alert('Failed to load products');
    }
  };

  const handleStockChange = (id, value) => {
    setStockUpdates(prev => ({ ...prev, [id]: value }));
  };

  const updateStock = async (id) => {
    try {
      const stock = parseInt(stockUpdates[id], 10);
      if (isNaN(stock) || stock < 0) {
        alert('Invalid stock value');
        return;
      }

      const product = products.find(p => p.id === id);
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('actualPrice', product.actualprice);
      formData.append('stock', stock);
      formData.append('imageFile', product.image);

      const token = localStorage.getItem('token');
      if (stock === 0 && user?.role === 'admin') {
        const confirmDelete = window.confirm('Stock is zero. Delete product?');
        if (confirmDelete) {
          await axios.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Product deleted');
          fetchProducts();
          return;
        }
      }

      await axios.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Stock updated');
      fetchProducts();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('actualPrice', newProduct.actualPrice);
    formData.append('stock', newProduct.stock);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added');
      setNewProduct({ name: '', description: '', price: '', actualPrice:'' , stock: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      actualPrice: product.actualPrice,
      stock: product.stock,
      image: product.image || null,
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductData({
      name: '',
      description: '',
      price: '',
      actualPrice:'',
      stock: '',
      image: null,
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) {
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setEditImagePreview(null);
    }
  };

  const saveEdit = async (id) => {
    const formData = new FormData();
    formData.append('name', editProductData.name);
    formData.append('description', editProductData.description);
    formData.append('price', editProductData.price);
    formData.append('actualPrice',editproductData.actualPrice);
    formData.append('stock', editProductData.stock);
    if (editImageFile) {
      formData.append('imageFile', editImageFile);
    } else if (editProductData.image) {
      formData.append('imageFile', editProductData.image);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product updated');
      cancelEdit();
      fetchProducts();
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const filterProducts = () => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

      {user?.role === 'admin' && (
        <form onSubmit={handleAddProduct} className="mb-8 border p-4 rounded space-y-4">
          <h2 className="text-xl font-semibold">Add Product</h2>
          <input type="text" placeholder="Name" value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full p-2 border" required />
          <textarea placeholder="Description" value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full p-2 border" required />
          <input type="number" placeholder="Price" value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full p-2 border" required />
          <input
            type="number"
            placeholder="Actual Price"
            value={newProduct.actualPrice || ''}
            onChange={e => setNewProduct({ ...newProduct, actualPrice: e.target.value })}
            className="w-full p-2 border"
            required
          />
          <input type="number" placeholder="Stock" value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full p-2 border" required />
          <input type="file" onChange={handleImageChange} className="w-full p-2 border" />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover" />
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="p-2 border rounded mb-4 w-full max-w-md"
      />

      <div className="products-grid">
        {filterProducts().map(product => {
          const isEditing = editingProductId === product.id;
          const { id, name, description, price, stock, image } = product;

          return (
            <div key={id} className="products-card1 border p-3 mb-3 rounded">
              {isEditing ? (
                <>
                  <input type="text" value={editProductData.name}
                    onChange={e => setEditProductData({ ...editProductData, name: e.target.value })}
                    className="w-full p-1 border mb-1" />
                  <textarea value={editProductData.description}
                    onChange={e => setEditProductData({ ...editProductData, description: e.target.value })}
                    className="w-full p-1 border mb-1" />
                  <input type="number" value={editProductData.price}
                    onChange={e => setEditProductData({ ...editProductData, price: e.target.value })}
                    className="w-full p-1 border mb-1" />
                  <input
                    type="number"
                    placeholder="actual Price"
                    value={editProductData.actualPrice || ''}
                    onChange={e => setEditProductData({ ...editProductData, actualPrice: e.target.value })}
                    className="w-full p-2 border"
                    required
                  />
                  <input type="number" value={editProductData.stock}
                    onChange={e => setEditProductData({ ...editProductData, stock: e.target.value })}
                    className="w-full p-1 border mb-1" />
                  <input type="file" onChange={handleEditImageChange}
                    className="w-full p-1 border mb-1" />
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="New Preview" className="w-24 h-24 object-cover" />
                  ) : (
                    editProductData.image && (
                      <img
                        src={`https://back-gf-production.up.railway.app/uploads/${editProductData.image}`}
                        alt="Current"
                        className="w-24 h-24 object-cover"
                      />
                    )
                  )}
                  <div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => saveEdit(id)}>Save</button>
                    <button className="bg-gray-400 text-black px-3 py-1 rounded"
                      onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-semibold mb-2">{name} - KES {price}</h2>
                  <img
                    src={`https://back-gf-production.up.railway.app/uploads/${image}`}
                    alt={name}
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                  <p className="mt-2 text-sm">{description}</p>
                  <p className="text-sm text-gray-600">Current Stock: {stock}</p>

                  <input
                    type="number"
                    placeholder="New stock"
                    className="border p-1 w-24 mr-2 mt-2"
                    onChange={e => handleStockChange(id, e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 mt-2"
                    onClick={() => updateStock(id)}
                  >
                    Update Stock
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;

