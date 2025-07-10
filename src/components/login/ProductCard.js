const ProductCard = ({ product, onAdd }) => {
  const { id, name, price, image, description } = product;

  return (
   <div key={id} className="bg-white  dark:bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
  <div className="top mb-3">
    {image && (
      <img
        src={`http://localhost:5000/uploads/${image}`}
        alt={name}
        className="w-fit h-48 object-cover rounded-md mb-2 object-center"
      />
    )}
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h3>
  </div>
  <p className="text-green-600 font-medium mb-1">KES {price}</p>
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
  <button
    onClick={onAdd}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
  >
    Add to Cart
  </button>
</div>


  );
};

export default ProductCard;
