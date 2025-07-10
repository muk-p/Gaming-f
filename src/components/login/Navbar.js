const Navbar = ({ searchTerm, setSearchTerm, filteredProducts, toggleLogin, toggleCart, cartLength }) => (
  <div className="flex items-center justify-between fixed px-6 py-2 right-0 left-0 bg-white shadow-md dark:bg-gray-900 z-50">
    <div className="flex items-center space-x-3">
      <img src="../../../public/logo.svg.png" alt="Logo" className="w-12 h-12" />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gaming Store</h1>
    </div>

    <div className="relative w-1/2 max-w-md">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />
      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded shadow-md dark:bg-gray-800 dark:border-gray-700">
          {filteredProducts.slice(0, 8).map(product => (
            <li
              key={product.id}
              onClick={() => setSearchTerm(product.name)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="flex items-center space-4">
      <svg
        onClick={toggleLogin}
        className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
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
      <svg
        onClick={toggleCart}
        className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
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
      <span className="text-gray-800 bg-red-500 w-5 h-5 rounded-full text-center relative right-1 bottom-2 dark:text-white font-medium">{cartLength}</span>
    </div>
  </div>

);

export default Navbar;
