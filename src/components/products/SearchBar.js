const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
    className="p-2 border rounded w-full mb-4"
  />
);

export default SearchBar;
