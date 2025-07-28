const ProductList = ({ products, user, form, setForm, edit, setEdit, preview, setPreview, fetchData }) => {
  const handleEdit = (product) => {
    setEdit(product.id);
    setForm({ ...product, image: null });
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div key={p.id} className="border p-4 rounded shadow">
          {edit === p.id ? (
            <>
              <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-1 border rounded mb-1" />
              <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-1 border rounded mb-1" />
              <input name="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-1 border rounded mb-1" />
              <input name="actualPrice" type="number" value={form.actualPrice} onChange={(e) => setForm({ ...form, actualPrice: e.target.value })} className="w-full p-1 border rounded mb-1" />
              <input name="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full p-1 border rounded mb-1" />
              <input name="image" type="file" onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }} className="w-full p-1 border rounded mb-1" />
              {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover" />}
            </>
          ) : (
            <>
              <h2 className="font-semibold text-lg">{p.name} - KES {p.price}</h2>
              <img src={`https://back-gf-production.up.railway.app/uploads/${p.imageFile}`} alt={p.name} className="w-24 h-24 object-cover rounded mb-2" />
              <p className="text-sm mb-1">{p.description}</p>
              <p className="text-sm text-gray-600 mb-1">Stock: {p.stock}</p>
              {user?.role === 'admin' && (
                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
