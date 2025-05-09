import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Filter,
  RefreshCw,
  CheckSquare,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { officers, cases } from "../../data/data";

export default function CaseManagementSystem() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [notifications, setNotifications] = useState(3);

  // Combine case data with officer names
  const casesWithOfficerNames = cases.map((caseItem) => {
    const assignedOfficer = officers.find(
      (officer) => officer.id === caseItem.assignedTo
    );
    return {
      ...caseItem,
      officerName: assignedOfficer ? assignedOfficer.name : "Unassigned",
    };
  });

  // Filter cases based on active tab, search term, officer, and priority
  useEffect(() => {
    let result = casesWithOfficerNames;

    // Filter by tab (case status)
    if (activeTab !== "all") {
      result = result.filter((caseItem) =>
        activeTab === "active"
          ? caseItem.status === "Open" || caseItem.status === "In Progress"
          : caseItem.status === "Closed"
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(term) ||
          caseItem.caseId.toLowerCase().includes(term) ||
          caseItem.category.toLowerCase().includes(term) ||
          caseItem.officerName.toLowerCase().includes(term)
      );
    }

    // Filter by officer
    if (selectedOfficer !== "all") {
      result = result.filter(
        (caseItem) => caseItem.assignedTo === parseInt(selectedOfficer)
      );
    }

    // Filter by priority
    if (selectedPriority !== "all") {
      result = result.filter(
        (caseItem) => caseItem.priority === selectedPriority
      );
    }

    setFilteredCases(result);
  }, [activeTab, searchTerm, selectedOfficer, selectedPriority]);

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "In Progress":
        return <Clock size={16} className="text-blue-500" />;
      case "Closed":
        return <CheckSquare size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg">

      {/* Filters and Search */}
      <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-3">
        <div className="relative flex-grow">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search cases..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
            >
              <option value="all">All Officers</option>
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.name}
                </option>
              ))}
            </select>
            <Filter
              size={18}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Filter
              size={18}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 font-medium text-sm ${
            activeTab === "active"
              ? "text-green-500 border-b-2 border-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Cases
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm ${
            activeTab === "closed"
              ? "text-green-500 border-b-2 border-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Closed Cases
        </button>
        <button
          className={`px-4 py-3 font-medium text-sm ${
            activeTab === "all"
              ? "text-green-500 border-b-2 border-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Cases
        </button>
      </div>

      {/* Cases List */}
      <div className="flex-grow overflow-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <tr
                  key={caseItem.caseId}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {caseItem.caseId}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {caseItem.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(caseItem.status)}
                      <span>{caseItem.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span
                      className={`${getPriorityColor(
                        caseItem.priority
                      )} text-white text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {caseItem.officerName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(caseItem.lastUpdated)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {caseItem.evidenceCount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  No cases found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-100 px-4 py-3 border-t rounded-b-lg flex justify-between items-center text-sm">
        <div>
          <span className="font-medium">{filteredCases.length}</span> cases
          {activeTab !== "all" && (
            <span> • {activeTab === "active" ? "Active" : "Closed"}</span>
          )}
          {selectedOfficer !== "all" && <span> • Filtered by officer</span>}
          {selectedPriority !== "all" && (
            <span> • Priority: {selectedPriority}</span>
          )}
        </div>
        <div className="text-green-500 font-medium">
          Latest update: May 9, 2025
        </div>
      </div>
    </div>
  );
}
