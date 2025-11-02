import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    actualPrice: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    name: "",
    description: "",
    price: "",
    actualPrice: "",
    stock: "",
    imageFile: null,
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load products from localStorage or products.json
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem("products"));
        if (localData && localData.length) {
          setProducts(localData);
        } else {
          const res = await fetch("/products.json");
          const data = await res.json();
          setProducts(data);
          localStorage.setItem("products", JSON.stringify(data));
        }
      } catch (err) {
        alert("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const saveToLocal = (data) => {
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };

  // Handle stock updates
  const handleStockChange = (id, value) => {
    setStockUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const updateStock = (id) => {
    const stock = parseInt(stockUpdates[id], 10);
    if (isNaN(stock) || stock < 0) {
      alert("Invalid stock value");
      return;
    }
    const updated = products.map((p) =>
      p.id === id ? { ...p, stock } : p
    );
    saveToLocal(updated);
    alert("Stock updated locally");
  };

  // Handle adding new product
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newItem = {
      id: newId,
      ...newProduct,
      price: parseFloat(newProduct.price),
      actualPrice: parseFloat(newProduct.actualPrice),
      stock: parseInt(newProduct.stock, 10),
      imageFile: imagePreview || "placeholder.png",
    };
    const updated = [...products, newItem];
    saveToLocal(updated);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      actualPrice: "",
      stock: "",
    });
    setImageFile(null);
    setImagePreview(null);
    alert("Product added locally");
  };

  // Editing
  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      actualPrice: product.actualPrice,
      stock: product.stock,
      imageFile: product.imageFile,
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductData({
      name: "",
      description: "",
      price: "",
      actualPrice: "",
      stock: "",
      imageFile: null,
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) setEditImagePreview(URL.createObjectURL(file));
    else setEditImagePreview(null);
  };

  const saveEdit = (id) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            ...editProductData,
            imageFile: editImagePreview || p.imageFile,
          }
        : p
    );
    saveToLocal(updated);
    cancelEdit();
    alert("Product updated locally");
  };

  // Filtering
  const filterProducts = () => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Products (Local)</h1>

      {/* Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="mb-8 border p-4 rounded space-y-4"
      >
        <h2 className="text-xl font-semibold">Add Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="w-full p-2 border"
          required
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="w-full p-2 border"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="w-full p-2 border"
          required
        />
        <input
          type="number"
          placeholder="Actual Price"
          value={newProduct.actualPrice}
          onChange={(e) =>
            setNewProduct({ ...newProduct, actualPrice: e.target.value })
          }
          className="w-full p-2 border"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          className="w-full p-2 border"
          required
        />
        <input type="file" onChange={handleImageChange} className="w-full p-2 border" />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 object-cover"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded mb-4 w-full max-w-md"
      />

      {/* Products List */}
      <div className="products-grid">
        {filterProducts().map((product) => {
          const isEditing = editingProductId === product.id;
          const { id, name, description, price, actualPrice, stock, imageFile } =
            product;

          return (
            <div key={id} className="border p-3 mb-3 rounded">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editProductData.name}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-1 border mb-1"
                  />
                  <textarea
                    value={editProductData.description}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-1 border mb-1"
                  />
                  <input
                    type="number"
                    value={editProductData.price}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        price: e.target.value,
                      })
                    }
                    className="w-full p-1 border mb-1"
                  />
                  <input
                    type="number"
                    value={editProductData.actualPrice}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        actualPrice: e.target.value,
                      })
                    }
                    className="w-full p-1 border mb-1"
                  />
                  <input
                    type="number"
                    value={editProductData.stock}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        stock: e.target.value,
                      })
                    }
                    className="w-full p-1 border mb-1"
                  />
                  <input
                    type="file"
                    onChange={handleEditImageChange}
                    className="w-full p-1 border mb-1"
                  />
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="New Preview"
                      className="w-24 h-24 object-cover"
                    />
                  ) : (
                    <img
                      src={imageFile}
                      alt="Current"
                      className="w-24 h-24 object-cover"
                    />
                  )}
                  <div>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => saveEdit(id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-black px-3 py-1 rounded"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-semibold mb-2">
                    {name} - KES {actualPrice}
                  </h2>
                  <img
                    src={imageFile.startsWith("blob:") ? imageFile : `/uploads/${imageFile}`}
                    alt={name}
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                  <p className="mt-2 text-sm">{description}</p>
                  <p className="text-sm text-gray-600">Current Stock: {stock}</p>

                  <input
                    type="number"
                    placeholder="New stock"
                    className="border p-1 w-24 mr-2 mt-2"
                    onChange={(e) => handleStockChange(id, e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 mt-2"
                    onClick={() => updateStock(id)}
                  >
                    Update Stock
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>
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
