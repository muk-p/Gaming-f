const NavigationTab = ({ navigate, close }) => (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <form className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Navigate to</h2>
    
    <ul className="space-y-2">
      <li>
        <button
          type="button"
          onClick={() => {
            navigate('/Products');
            close();
          }}
          className="w-full text-left text-blue-600 hover:underline dark:text-blue-400"
        >
          Products
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => {
            navigate('/Sales');
            close();
          }}
          className="w-full text-left text-blue-600 hover:underline dark:text-blue-400"
        >
          Sales
        </button>
      </li>
    </ul>
  </form>
</div>

);

export default NavigationTab;
