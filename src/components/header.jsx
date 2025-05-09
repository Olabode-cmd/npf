import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { getuser } from '../services/auth';

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getuser();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    loadUser();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-green-600 lg:hidden mr-4"
        >
          <Menu size={24} />
        </button>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-64 p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-600 focus:border-green-600"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-green-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full"
            src="https://icons.iconarchive.com/icons/aha-soft/free-large-boss/256/Police-Officer-icon.png"
            alt="Profile"
          />
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500">
              {user ? user.officer_id : ''}
            </p>
          </div>
          <ChevronDown size={16} className="ml-2 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
