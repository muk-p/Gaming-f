import { useNavigate } from "react-router-dom";

const CartOverlay = ({ cart, setCart, total, onRemove, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cart is empty</p>
        ) : (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex justify-between items-start border-b pb-2 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.qty} × KES {item.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 font-semibold text-gray-800 dark:text-white">
          Total: KES {total}
        </p>

        <button
          type="button"
          onClick={() => {
            navigate('/checkout');
            onClose();
          }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md transition"
        >
          Checkout
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 w-full py-2 rounded-md transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Close
        </button>
      </form>
    </div>
  );
};

export default CartOverlay;
