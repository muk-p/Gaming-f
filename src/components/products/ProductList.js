import { useEffect, useState } from "react";

const ProductList = ({ user, form, setForm, edit, setEdit, preview, setPreview }) => {
  const [products, setProducts] = useState([]);

  // ✅ Fetch latest data dynamically from /public/products.json
  const fetchData = async () => {
    try {
      const res = await fetch("/products.json");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (product) => {
    setEdit(product.id);
    setForm({ ...product, imageFile: product.imageFile || "", image: null });
    setPreview(null);
  };

  const handleSave = () => {
    // Save edited product locally and persist to localStorage
    const updated = products.map((p) =>
      p.id === edit ? { ...p, ...form, imageFile: preview || form.imageFile } : p
    );
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    setEdit(null);
    setPreview(null);
  };

  // ✅ Load from localStorage first if available
  useEffect(() => {
    const local = localStorage.getItem("products");
    if (local) {
      setProducts(JSON.parse(local));
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div key={p.id} className="border p-4 rounded shadow">
          {edit === p.id ? (
            <>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />
              <input
                name="actualPrice"
                type="number"
                value={form.actualPrice}
                onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />

              {/* URL or upload option */}
              <label className="block text-sm font-semibold mt-2">Image (URL or Upload)</label>
              <input
                name="imageFile"
                type="text"
                placeholder="Paste image URL..."
                value={form.imageFile}
                onChange={(e) => setForm({ ...form, imageFile: e.target.value })}
                className="w-full p-1 border rounded mb-1"
              />
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setForm({ ...form, image: file });
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full p-1 border rounded mb-1"
              />

              {(preview || form.imageFile) && (
                <img
                  src={preview || form.imageFile}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              )}

              <div className="mt-2 space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEdit(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-lg">{p.name} - KES {p.price}</h2>
              <img
                src={p.imageFile}
                alt={p.name}
                className="w-24 h-24 object-cover rounded mb-2"
              />
              <p className="text-sm mb-1">{p.description}</p>
              <p className="text-sm text-gray-600 mb-1">Stock: {p.stock}</p>
              {user?.role === "admin" && (
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
