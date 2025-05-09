import React, { useState } from 'react';
import { 
  FileText, Map, AlertTriangle, Search, Plus, Upload, Filter, 
  ArrowUpRight, CheckCircle, Clock
} from 'lucide-react';
import { cases } from '../../data/data' // Importing the dummy data

// Main Crime Reporting Module
const CrimeReporting = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Crime Reporting Module</h1>
        <p className="text-gray-600">Manage crime reports, complaints, and incidents</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
        <TabButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={<FileText size={18} />}
          label="Dashboard"
        />
        <TabButton 
          active={activeTab === 'reports'} 
          onClick={() => setActiveTab('reports')}
          icon={<AlertTriangle size={18} />}
          label="Recent Reports"
        />
        <TabButton 
          active={activeTab === 'map'} 
          onClick={() => setActiveTab('map')}
          icon={<Map size={18} />}
          label="GPS Map"
        />
        <TabButton 
          active={activeTab === 'submit'} 
          onClick={() => setActiveTab('submit')}
          icon={<Plus size={18} />}
          label="Submit Report"
        />
      </div>
      
      {/* Tab Content */}
      {activeTab === 'dashboard' && <ReportingDashboard />}
      {activeTab === 'reports' && <ReportsList />}
      {activeTab === 'map' && <GPSIncidentMap />}
      {activeTab === 'submit' && <SubmitReportForm />}
    </div>
  );
};

// Dashboard Tab
const ReportingDashboard = () => {
  // Filter cases to get only recent ones (last 30 days)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 30);
  
  const recentCases = cases.filter(c => new Date(c.dateReported) >= recentDate);
  
  // Get some statistics
  const openCases = cases.filter(c => c.status === 'Open').length;
  const highPriorityCases = cases.filter(c => c.priority === 'High' || c.priority === 'Critical').length;
  const solvedCases = cases.filter(c => c.status === 'Closed').length;
  
  // Categories count
  const categories = {};
  cases.forEach(c => {
    categories[c.category] = (categories[c.category] || 0) + 1;
  });
  
  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="New Reports"
          value={recentCases.length}
          icon={<FileText className="text-blue-500" />}
          trend="+15%"
          trendUp={true}
        />
        <StatCard 
          title="Open Cases"
          value={openCases}
          icon={<Clock className="text-yellow-500" />}
          trend="-3%"
          trendUp={false}
        />
        <StatCard 
          title="High Priority"
          value={highPriorityCases}
          icon={<AlertTriangle className="text-red-500" />}
          trend="+8%"
          trendUp={true}
        />
        <StatCard 
          title="Solved Cases"
          value={solvedCases}
          icon={<CheckCircle className="text-green-500" />}
          trend="+22%"
          trendUp={true}
        />
      </div>
      
      {/* Recent Reports & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Reports</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View All <ArrowUpRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {recentCases.slice(0, 5).map((reportCase) => (
              <div key={reportCase.caseId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-800">{reportCase.title}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500">{reportCase.dateReported}</span>
                    <PriorityBadge priority={reportCase.priority} />
                  </div>
                </div>
                <StatusBadge status={reportCase.status} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Crime Categories</h2>
          <div className="space-y-4">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}</span>
                <div className="w-full mx-4">
                  <div className="bg-gray-200 h-2 rounded-full w-full">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / cases.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-gray-900 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard 
          title="Submit New Report"
          description="File a new crime report or complaint"
          icon={<Plus size={24} />}
          color="bg-green-500"
        />
        <QuickActionCard 
          title="Search Reports"
          description="Find and filter existing reports"
          icon={<Search size={24} />}
          color="bg-blue-500"
        />
        <QuickActionCard 
          title="View Crime Map"
          description="See incidents mapped by location"
          icon={<Map size={24} />}
          color="bg-purple-500"
        />
      </div>
    </div>
  );
};

// Reports List Tab
const ReportsList = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter cases based on current filter and search term
  const filteredCases = cases.filter(c => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'open' && c.status === 'Open') ||
      (filter === 'inProgress' && c.status === 'In Progress') ||
      (filter === 'closed' && c.status === 'Closed') ||
      (filter === 'highPriority' && (c.priority === 'High' || c.priority === 'Critical'));
      
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('open')}
              className={`px-3 py-2 rounded-md text-sm ${filter === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              Open
            </button>
            <button 
              onClick={() => setFilter('inProgress')}
              className={`px-3 py-2 rounded-md text-sm ${filter === 'inProgress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter('highPriority')}
              className={`px-3 py-2 rounded-md text-sm ${filter === 'highPriority' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            >
              High Priority
            </button>
          </div>
        </div>
      </div>
      
      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map((caseItem) => (
              <tr key={caseItem.caseId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{caseItem.caseId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{caseItem.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={caseItem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={caseItem.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{caseItem.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{caseItem.dateReported}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{caseItem.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                  <button>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredCases.length}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              2
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              3
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

// GPS Incident Map Tab
const GPSIncidentMap = () => {
  // Filter options
  const [timeframe, setTimeframe] = useState('all');
  const [category, setCategory] = useState('all');
  
  // Map dummy incidents with coordinates
  const mapIncidents = cases.map(c => ({
    ...c,
    // Generate random coordinates within a reasonable range
    latitude: 9.0765 + (Math.random() * 0.1 - 0.05),
    longitude: 7.3986 + (Math.random() * 0.1 - 0.05)
  }));
  
  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crime Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="all">All Categories</option>
            <option value="Burglary">Burglary</option>
            <option value="Robbery">Robbery</option>
            <option value="Homicide">Homicide</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Narcotics">Narcotics</option>
            <option value="Fraud">Fraud</option>
            <option value="Traffic">Traffic</option>
            <option value="Gang">Gang Violence</option>
            <option value="Domestic Violence">Domestic Violence</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Search location..."
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>
        
        <div className="flex items-end">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-4 py-2 flex items-center">
            <Filter size={16} className="mr-2" /> Apply Filters
          </button>
        </div>
      </div>
      
      {/* Map Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-96 bg-gray-200 relative">
          {/* This would be replaced with an actual map component */}
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="text-center">
              <Map size={64} className="mx-auto text-blue-500 mb-2" />
              <p className="text-gray-500">Map would be displayed here using a mapping library</p>
              <p className="text-gray-400 text-sm">Showing {mapIncidents.length} incidents</p>
            </div>
          </div>
          
          {/* Show incident markers */}
          {mapIncidents.slice(0, 8).map((incident, index) => (
            <div 
              key={incident.caseId}
              className="absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
              style={{ 
                left: `${10 + index * 12}%`, 
                top: `${20 + (index % 5) * 15}%`,
                backgroundColor: getMarkerColor(incident.category)
              }}
              title={incident.title}
            >
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
          ))}
        </div>
        
        {/* Incidents List */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Recent Incidents</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {mapIncidents.slice(0, 8).map((incident, index) => (
              <div key={incident.caseId} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: getMarkerColor(incident.category) }}
                >
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{incident.category}</span>
                    <span>•</span>
                    <span>{incident.dateReported}</span>
                    <span>•</span>
                    <span>{incident.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Heatmap & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Crime Heatmap</h3>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500 text-sm">Heatmap visualization would be shown here</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Location Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Downtown</span>
              <div className="w-full mx-4">
                <div className="bg-gray-200 h-2 rounded-full w-full">
                  <div className="bg-red-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <span className="text-sm font-medium">35</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Northside</span>
              <div className="w-full mx-4">
                <div className="bg-gray-200 h-2 rounded-full w-full">
                  <div className="bg-red-600 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
              <span className="text-sm font-medium">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">West End</span>
              <div className="w-full mx-4">
                <div className="bg-gray-200 h-2 rounded-full w-full">
                  <div className="bg-red-600 h-2 rounded-full w-1/3"></div>
                </div>
              </div>
              <span className="text-sm font-medium">18</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Industrial Zone</span>
              <div className="w-full mx-4">
                <div className="bg-gray-200 h-2 rounded-full w-full">
                  <div className="bg-red-600 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
              <span className="text-sm font-medium">15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Submit Report Form Tab
const SubmitReportForm = () => {
  const [reportType, setReportType] = useState('citizen');
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Submit New Crime Report</h2>
      
      {/* Report Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'citizen' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            onClick={() => setReportType('citizen')}
          >
            Citizen Report
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'officer' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            onClick={() => setReportType('officer')}
          >
            Officer Input
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              reportType === 'anonymous' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            onClick={() => setReportType('anonymous')}
          >
            Anonymous Tip
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Case Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Category</label>
            <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select category</option>
              <option value="Burglary">Burglary</option>
              <option value="Robbery">Robbery</option>
              <option value="Assault">Assault</option>
              <option value="Theft">Theft</option>
              <option value="Fraud">Fraud</option>
              <option value="Vandalism">Vandalism</option>
              <option value="Narcotics">Narcotics</option>
              <option value="Domestic Violence">Domestic Violence</option>
              <option value="Cybercrime">Cybercrime</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Brief description of the incident"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date & Time</label>
            <input
              type="datetime-local"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          
          {reportType !== 'anonymous' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reporter Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="Phone number or email"
                />
              </div>
            </>
          )}
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Location</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Enter address or location details"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={useCurrentLocation}
              />
              <button 
                className="flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                onClick={() => {
                  setUseCurrentLocation(!useCurrentLocation);
                  if (!useCurrentLocation) {
                    setLocation("Using current location");
                  } else {
                    setLocation("");
                  }
                }}
              >
                <Map size={18} className="mr-1" />
                {useCurrentLocation ? "Clear" : "Use Current"}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              rows="5"
              placeholder="Provide all relevant details about the incident"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Evidence</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drag and drop files here or</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Browse files</button>
              <p className="text-xs text-gray-400 mt-1">Photos, videos, documents (max 10MB each)</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Witnesses Information</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              rows="2"
              placeholder="Names and contact information of any witnesses (if available)"
            ></textarea>
          </div>
        </div>
      </div>
      
      {/* Additional Info for Officer Input */}
      {reportType === 'officer' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-md font-medium text-blue-800 mb-3">Officer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Number</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter badge number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precinct</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter precinct"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Supervisor name"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Anonymous Tip Warning */}
      {reportType === 'anonymous' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex">
          <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-md font-medium text-yellow-800 mb-1">Anonymous Reporting Information</h3>
            <p className="text-sm text-yellow-700">
              Your identity will not be recorded when submitting an anonymous tip. We encourage providing as much detail as possible to help us investigate. Anonymous tips may have limited follow-up capabilities.
            </p>
          </div>
        </div>
      )}
      
      {/* Confirmation and Privacy Policy */}
      <div className="mt-6">
        <div className="flex items-start mb-4">
          <div className="flex items-center h-5">
            <input
              id="privacy"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
            />
          </div>
          <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
            I understand that filing a false report is a criminal offense. I confirm that the information provided is accurate to the best of my knowledge.
          </label>
        </div>
        
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
            />
          </div>
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Use</a>.
          </label>
        </div>
      </div>
      
      {/* Form Submission Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg">
          Save as Draft
        </button>
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg">
          Submit Report
        </button>
      </div>
    </div>
  );
};

// Utility Components

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md ${
        active 
          ? 'bg-green-600 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'} font-medium flex items-center`}>
          {trend} {trendUp ? '↑' : '↓'}
          <span className="text-gray-500 ml-1">vs. last month</span>
        </span>
      </div>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch(status) {
    case 'Open':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'In Progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Closed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Pending':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 ${bgColor} ${textColor} text-xs font-medium rounded-full`}>
      {status}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  let bgColor = '';
  let textColor = '';
  
  switch(priority) {
    case 'Low':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Medium':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'High':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      break;
    case 'Critical':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 ${bgColor} ${textColor} text-xs font-medium rounded-full`}>
      {priority}
    </span>
  );
};

// Helper function to get marker color based on crime category
const getMarkerColor = (category) => {
  const colors = {
    'Burglary': '#3B82F6', // blue
    'Robbery': '#EF4444', // red
    'Homicide': '#DC2626', // darker red
    'Cybercrime': '#8B5CF6', // purple
    'Narcotics': '#10B981', // green
    'Fraud': '#F59E0B', // amber
    'Traffic': '#6B7280', // gray
    'Gang': '#7C3AED', // violet
    'Domestic Violence': '#EC4899', // pink
    'Theft': '#F97316', // orange
    'Assault': '#B91C1C', // dark red
    'Vandalism': '#2DD4BF', // teal
  };
  
  return colors[category] || '#6B7280'; // Default to gray
};

// Additional Components Required
// Mobile Navigation for Responsive Design
const MobileNavigation = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-blue-600 hover:border-blue-600"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <span className="ml-2">Menu</span>
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
          </div>
          <div className="py-2">
            <MobileNavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => {
                setActiveTab('dashboard');
                setIsOpen(false);
              }}
              icon={<FileText size={18} />}
              label="Dashboard"
            />
            <MobileNavItem 
              active={activeTab === 'reports'} 
              onClick={() => {
                setActiveTab('reports');
                setIsOpen(false);
              }}
              icon={<AlertTriangle size={18} />}
              label="Recent Reports"
            />
            <MobileNavItem 
              active={activeTab === 'map'} 
              onClick={() => {
                setActiveTab('map');
                setIsOpen(false);
              }}
              icon={<Map size={18} />}
              label="GPS Map"
            />
            <MobileNavItem 
              active={activeTab === 'submit'} 
              onClick={() => {
                setActiveTab('submit');
                setIsOpen(false);
              }}
              icon={<Plus size={18} />}
              label="Submit Report"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Navigation Item
const MobileNavItem = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-left ${
        active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

// Notification Center Component
const NotificationCenter = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'alert',
      message: 'High priority case #CR-2023-0568 requires immediate attention',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'update',
      message: 'Case #CR-2023-0412 has been updated with new evidence',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      time: '3 hours ago'
    }
  ];
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          3
        </span>
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notification => (
              <div key={notification.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start">
                  {notification.type === 'alert' && (
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  {notification.type === 'update' && (
                    <Clock size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  {notification.type === 'info' && (
                    <FileText size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-200">
            <button className="text-xs text-blue-600 hover:text-blue-800 w-full text-center">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// User Profile Menu Component
const UserProfileMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
          JD
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-800">John Doe</p>
            <p className="text-xs text-gray-500">john.doe@agency.gov</p>
          </div>
          <div className="py-1">
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Profile Settings
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Notification Preferences
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Security
            </button>
          </div>
          <div className="py-1 border-t border-gray-200">
            <button className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Help & Support Component
const HelpSupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Help & Support</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Contact Support</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>Emergency Support: 555-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Phone size={16} />
                <span>Technical Support: 555-765-4321</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Documentation</h4>
              <ul className="space-y-1 text-sm">
                <li className="text-blue-600 hover:underline cursor-pointer">User Manual</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Report Guidelines</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Common Questions</li>
                <li className="text-blue-600 hover:underline cursor-pointer">System Requirements</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Training Resources</h4>
              <ul className="space-y-1 text-sm">
                <li className="text-blue-600 hover:underline cursor-pointer">Video Tutorials</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Quick Start Guide</li>
                <li className="text-blue-600 hover:underline cursor-pointer">Advanced Features</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Crime Reporting Module with Header and Mobile Support
const EnhancedCrimeReportingModule = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">CrimeTrack Pro</h1>
              <p className="text-xs text-gray-500">Law Enforcement Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <NotificationCenter />
            <UserProfileMenu />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crime Reporting Module</h2>
          <p className="text-gray-600">Manage crime reports, complaints, and incidents</p>
        </div>
        
        <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab Navigation - Hidden on Mobile */}
        <div className="hidden lg:flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          <TabButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<FileText size={18} />}
            label="Dashboard"
          />
          <TabButton 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')}
            icon={<AlertTriangle size={18} />}
            label="Recent Reports"
          />
          <TabButton 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')}
            icon={<Map size={18} />}
            label="GPS Map"
          />
          <TabButton 
            active={activeTab === 'submit'} 
            onClick={() => setActiveTab('submit')}
            icon={<Plus size={18} />}
            label="Submit Report"
          />
        </div>
        
        {/* Tab Content */}
        {activeTab === 'dashboard' && <ReportingDashboard />}
        {activeTab === 'reports' && <ReportsList />}
        {activeTab === 'map' && <GPSIncidentMap />}
        {activeTab === 'submit' && <SubmitReportForm />}
        
        {/* Help Modal */}
        <HelpSupportModal 
          isOpen={showHelpModal} 
          onClose={() => setShowHelpModal(false)} 
        />
      </div>
    </div>
)};

export default CrimeReporting;