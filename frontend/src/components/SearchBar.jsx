import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { search, setSearch, showSearch, setShowSearch, logoAndIcons } = useContext(ShopContext);

  const searchData = (logoAndIcons && Array.isArray(logoAndIcons.data))
  ? logoAndIcons.data.map(record => record.imageUrl)
  : []; 

  useEffect(() => {
    setVisible(location.pathname.includes('collection') && showSearch);
  }, [location, showSearch]); 

  if (!showSearch || !visible) return null; 

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 outline-none bg-inherit text-sm"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search"
          aria-label="Search input"
        />
        <img className="w-4" src={searchData[2]} alt="Search icon" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={searchData[13]}
        alt="Close search bar"
        aria-label="Close search"
      />
    </div>
  );
};

export default SearchBar;
