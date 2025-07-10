const LoginForm = ({ username, setUsername, password, setPassword, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <form onSubmit={onSubmit} className="w-full max-w-sm px-4">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg relative space-y-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center w-full">
          Login
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
      >
        Login
      </button>
    </div>
  </form>
</div>

);

export default LoginForm;
