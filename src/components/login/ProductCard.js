import React, { useState } from 'react';

const ProductCard = ({ product, onAdd }) => {
  const { id, name, price, actualPrice, imageFile, description } = product;
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const toggleDescription = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setIsDescriptionVisible(prev => !prev);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAdd();
  };

  return (
    <div
      key={id}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
      onClick={toggleDescription}
    >
      <div className="mb-3">
        <img
          src={`https://back-gf-production.up.railway.app/uploads/${imageFile}`}
          alt={name}
          className="w-full h-48 object-contain rounded-md mb-2 bg-gray-100"
        />
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      </div>

      <p className="text-green-600 font-medium">KES {actualPrice}</p>
      <p className="text-red-600 line-through text-sm mb-2">KES {price}</p>

      {isDescriptionVisible ? (
        <p className="text-sm text-gray-600 mb-3 transition-all duration-300">
          {description}
        </p>
      ) : (
        <p className="text-sm text-gray-400 mb-3 italic">Click to view description</p>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
