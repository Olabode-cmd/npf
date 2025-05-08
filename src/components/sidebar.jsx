import React from 'react';
import { X, Home, BarChart2, Users, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const currentPath = window.location.pathname;
  
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <Home size={20} /> },
    { path: "/dashboard/analytics", name: "Analytics", icon: <BarChart2 size={20} /> },
    { path: "/dashboard/users", name: "Users", icon: <Users size={20} /> },
    { path: "/dashboard/settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          {/* <h1 className="text-xl font-bold text-green-600">Dashboard</h1> */}
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-green-600 hidden lg:block">NPF Admin</h1>
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-green-600 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center text-sm px-4 py-3 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 ${
                    currentPath === item.path ? 'bg-green-50 text-green-600 font-medium' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;