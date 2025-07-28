const Navbar = ({ searchTerm, setSearchTerm, filteredProducts, toggleLogin, toggleCart, cartLength }) => (
  <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">

    {/* Left: Logo + Icons inline */}
    <div className="flex items-center justify-between w-full md:w-auto">
      <div className="flex items-center space-x-2">
        <img src="/logo.svg.png" alt="Logo" className="w-10 h-10 hover:scale-105 transition-transform" />
        <h1 className="text-xl font-bold text-gray-800 hidden sm:inline">Gaming Store</h1>
      </div>

      <div className="flex items-center space-x-4 md:ml-6">
        {/* Login Icon */}
        <button onClick={toggleLogin} className="text-gray-800 hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Cart Icon */}
        <button onClick={toggleCart} className="relative text-gray-800 hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2M7 13L5.4 5M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {cartLength > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
              {cartLength}
            </span>
          )}
        </button>
      </div>
    </div>

    {/* Search Input */}
    <div className="relative w-full md:w-1/2 max-w-md">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
          {filteredProducts.slice(0, 8).map(product => (
            <li
              key={product.id}
              onClick={() => setSearchTerm(product.name)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  </nav>
);

export default Navbar;
