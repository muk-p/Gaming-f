import axios from '../../api/axios';

const ProductForm = ({ form, setForm, preview, setPreview, fetchData, edit, setEdit }) => {
  const isEditing = Boolean(edit);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key === 'image' ? 'imageFile1' : key, value);
    });

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      if (isEditing) {
        await axios.put(`/products/${edit}`, formData, { headers });
        alert('Product updated');
      } else {
        await axios.post('/products', formData, { headers });
        alert('Product added');
      }

      setForm({ name: '', description: '', price: '', actualPrice: '', stock: '', image: null });
      setPreview(null);
      setEdit(null);
      fetchData();
    } catch {
      alert(isEditing ? 'Failed to update product' : 'Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="actualPrice" type="number" placeholder="Actual Price" value={form.actualPrice} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="image" type="file" onChange={handleChange} className="w-full p-2 border rounded" />
      {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover" />}
      <button type="submit" className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>
        {isEditing ? 'Save Changes' : 'Add Product'}
      </button>
      {isEditing && (
        <button type="button" onClick={() => setEdit(null)} className="ml-2 bg-gray-400 px-4 py-2 rounded text-black">
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm;
