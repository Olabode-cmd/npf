import React, { useState } from "react";
import {
  X,
  Home,
  BarChart2,
  Users,
  Settings,
  LogOut,
  FileText,
  UserCheck,
  Briefcase,
  Database,
  Gavel,
  HeartHandshake,
  AlertTriangle,
  Shield,
  Globe,
  Smartphone,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const currentPath = window.location.pathname;

  // State to track which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Toggle dropdown state
  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Menu structure with one dropdown example for Administrative Management
  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/dashboard/crime-reporting",
      name: "Crime Reporting",
      icon: <FileText size={20} />,
    },
    {
      path: "/dashboard/booking",
      name: "Suspect Booking",
      icon: <UserCheck size={20} />,
    },
    {
      path: "/dashboard/cases",
      name: "Case Management",
      icon: <Briefcase size={20} />,
    },
    {
      path: "/dashboard/evidence",
      name: "Evidence Tracking",
      icon: <Database size={20} />,
    },
    {
      path: "/dashboard/court",
      name: "Court Integration",
      icon: <Gavel size={20} />,
    },
    {
      path: "/dashboard/victim-support",
      name: "Victim & Witness",
      icon: <HeartHandshake size={20} />,
    },
    {
      path: "/dashboard/analytics",
      name: "Crime Analytics",
      icon: <BarChart2 size={20} />,
    },
    {
      name: "Administrative",
      icon: <Shield size={20} />,
      isDropdown: true,
      children: [
        { path: "/dashboard/admin/officers", name: "Officer Management" },
        { path: "/dashboard/admin/resources", name: "Resource Allocation" },
        { path: "/dashboard/admin/performance", name: "Performance Metrics" },
      ],
    },
    {
      path: "/dashboard/integrations",
      name: "Integrations",
      icon: <Globe size={20} />,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: <Settings size={20} />,
    },
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
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-8 w-auto mr-2" />
            <h1 className="text-xl font-bold text-green-600">NPF Admin</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-green-600 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto max-h-screen pb-20">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.isDropdown ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center justify-between w-full text-sm px-4 py-3 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      {openDropdowns[item.name] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {/* Dropdown items */}
                    {openDropdowns[item.name] && (
                      <ul className="pl-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`flex items-center text-sm px-4 py-2 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 ${
                                currentPath === child.path
                                  ? "bg-green-50 text-green-600 font-medium"
                                  : ""
                              }`}
                            >
                              <span className="ml-2">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center text-sm px-4 py-3 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 ${
                      currentPath === item.path
                        ? "bg-green-50 text-green-600 font-medium"
                        : ""
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600">
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