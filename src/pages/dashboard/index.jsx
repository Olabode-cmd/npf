import { officers, cases, departments, suspects } from "../../data/data";
import {
  BarChart,
  PieChart,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Search,
  Calendar,
  Clock,
  User,
  Briefcase,
  Shield,
} from "lucide-react";

const Dashboard = () => {
  const totalOfficers = officers.length;
  const activeCases = cases.filter(
    (c) => c.status === "Open" || c.status === "In Progress"
  ).length;
  const closedCases = cases.filter((c) => c.status === "Closed").length;
  const wantedSuspects = suspects.filter((s) => s.status === "Wanted").length;

  // Status badges with appropriate colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Open
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        );
      case "Closed":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Priority badges with appropriate colors
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            High
          </span>
        );
      case "Medium":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            Medium
          </span>
        );
      case "Low":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {priority}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Metrics */} 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Officers
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {totalOfficers}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FileText className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Cases</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeCases}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Closed Cases</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {closedCases}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Wanted Suspects
              </p>
              <h2 className="text-2xl font-bold text-gray-800">
                {wantedSuspects}
              </h2>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileText size={18} className="text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-800">
                    Recent Cases
                  </h2>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Case ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cases.slice(0, 5).map((c) => (
                      <tr key={c.caseId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {c.caseId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {c.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(c.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPriorityBadge(c.priority)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {officers.find((o) => o.id === c.assignedTo)?.name ||
                            "Unassigned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Briefcase size={18} className="text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-800">
                    Departments
                  </h2>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Manage
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Head
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departments.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {d.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {d.head}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {d.activeCases}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          ${d.budget.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Wanted Suspects */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={18} className="text-red-600" />
                  <h2 className="font-bold text-lg text-gray-800">
                    Wanted Suspects
                  </h2>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View all
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {suspects
                    .filter((s) => s.status === "Wanted")
                    .slice(0, 5)
                    .map((s) => (
                      <li key={s.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User size={20} className="text-gray-500" />
                          </div>
                          <h3 className="font-medium text-gray-800">
                            {s.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {s.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Last seen: {s.lastKnownLocation}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Calendar/Upcoming */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-800">
                    Upcoming Events
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Department Meeting
                      </p>
                      <p className="text-xs text-gray-500">Tomorrow, 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Training Session
                      </p>
                      <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Budget Review
                      </p>
                      <p className="text-xs text-gray-500">
                        Next Monday, 11:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;