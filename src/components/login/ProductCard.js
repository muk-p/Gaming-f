import React, { useState } from 'react';

const ProductCard = ({ product, onAdd }) => {
  const { id, name, price, imageUrl, description } = product;
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const toggleDescription = (e) => {
    // Prevent toggle when "Add to Cart" button is clicked
    if (e.target.tagName === 'BUTTON' || e.target.parentElement.tagName === 'BUTTON') {
      return;
    }
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click event when button is clicked
    onAdd();
  };

  return (
   <div
      key={id}
      className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
      onClick={toggleDescription}
    >
      <div className="top mb-3">
        <img
          src={`https://back-gf-production.up.railway.app/uploads/${product.image}`}
          alt={name}
          className="w-full h-48 object-cover rounded-md mb-2"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h3>
      </div>
      <p className="text-green-600 font-medium mb-1">KES {price}</p>
      {isDescriptionVisible && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-2 transition-all duration-300 ease-in-out">
          {description}
        </p>
      )}
      {!isDescriptionVisible && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 mt-2 italic">
          Click to view description
        </p>
      )}
      <button
        onClick={handleAddToCart} // Use the new handler
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
