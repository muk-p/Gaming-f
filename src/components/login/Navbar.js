const Navbar = ({ searchTerm, setSearchTerm, filteredProducts, toggleLogin, toggleCart, cartLength }) => (
  <div className="flex items-center justify-between fixed px-6 py-2 right-0 left-0 bg-white shadow-md dark:bg-gray-900 z-50">
    {/* Logo */}
    <div className="flex items-center space-x-3 cursor-pointer">
      <img src="../../../public/logo.svg.png" alt="Logo" className="w-12 h-12 transition-transform duration-200 hover:scale-105" />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gaming Store</h1>
    </div>

    {/* Search Input */}
    <div className="relative w-1/2 max-w-md">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />
      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg transition-all duration-200 max-h-64 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {filteredProducts.slice(0, 8).map(product => (
            <li
              key={product.id}
              onClick={() => setSearchTerm(product.name)}
              className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Icons */}
    <div className="flex items-center space-x-4 relative">
      <svg
        onClick={toggleLogin}
        className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:scale-110 transition-transform"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18 6H6m12 4H6m12 4H6m12 4H6"
        />
      </svg>

      <div className="relative">
        <svg
          onClick={toggleCart}
          className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:scale-110 transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>
        {cartLength > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
            {cartLength}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Navbar;
