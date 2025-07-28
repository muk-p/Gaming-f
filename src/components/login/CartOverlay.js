import { useNavigate } from "react-router-dom";

const CartOverlay = ({ cart, total, onRemove, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex justify-between items-start border-b pb-2"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} × KES {item.price}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 font-semibold text-gray-800">
          Total: KES {total.toLocaleString()}
        </p>

        <button
          onClick={() => {
            navigate("/checkout");
            onClose();
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md transition"
        >
          Proceed to Checkout
        </button>

        <button
          onClick={onClose}
          className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 w-full py-2 rounded-md transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CartOverlay;
