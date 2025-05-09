import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Camera,
  Database,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Import data from the pasted content
import { cases, officers, departments } from "../../data/data";

// Create additional mock data for evidence tracking
const evidenceItems = [
  {
    id: "EV-001",
    caseId: "C-001",
    type: "Physical",
    description: "Broken glass from display case",
    collectedBy: 1,
    dateCollected: "2025-05-01",
    location: "Evidence Locker A",
    status: "Processing",
    chain: [
      { officer: 1, action: "Collected", timestamp: "2025-05-01 10:30" },
      {
        officer: 14,
        action: "Submitted to Lab",
        timestamp: "2025-05-02 09:15",
      },
    ],
  },
  {
    id: "EV-002",
    caseId: "C-001",
    type: "Digital",
    description: "CCTV Footage",
    collectedBy: 1,
    dateCollected: "2025-05-01",
    location: "Digital Storage Server",
    status: "Analyzed",
    chain: [
      { officer: 1, action: "Collected", timestamp: "2025-05-01 11:45" },
      { officer: 2, action: "Analysis", timestamp: "2025-05-03 14:20" },
      { officer: 1, action: "Case File Update", timestamp: "2025-05-04 16:00" },
    ],
  },
  {
    id: "EV-003",
    caseId: "C-001",
    type: "Physical",
    description: "Fingerprints from countertop",
    collectedBy: 1,
    dateCollected: "2025-05-01",
    location: "Lab Processing",
    status: "Processing",
    chain: [
      { officer: 1, action: "Collected", timestamp: "2025-05-01 10:45" },
      {
        officer: 9,
        action: "Lab Analysis Started",
        timestamp: "2025-05-02 13:30",
      },
    ],
  },
  {
    id: "EV-004",
    caseId: "C-002",
    type: "Digital",
    description: "Server Logs",
    collectedBy: 2,
    dateCollected: "2025-04-28",
    location: "Cybercrime Server",
    status: "Analyzed",
    chain: [
      { officer: 2, action: "Acquired", timestamp: "2025-04-28 15:20" },
      { officer: 2, action: "Initial Analysis", timestamp: "2025-04-29 10:00" },
      { officer: 20, action: "Deep Analysis", timestamp: "2025-05-01 09:30" },
      {
        officer: 2,
        action: "Findings Report Added",
        timestamp: "2025-05-03 11:45",
      },
    ],
  },
  {
    id: "EV-005",
    caseId: "C-002",
    type: "Digital",
    description: "Victim Bank Statements",
    collectedBy: 2,
    dateCollected: "2025-04-29",
    location: "Case File Storage",
    status: "Filed",
    chain: [
      { officer: 2, action: "Received", timestamp: "2025-04-29 14:10" },
      { officer: 2, action: "Analyzed", timestamp: "2025-04-30 13:25" },
      { officer: 6, action: "Cross-referenced", timestamp: "2025-05-02 10:15" },
    ],
  },
  {
    id: "EV-006",
    caseId: "C-004",
    type: "Physical",
    description: "Bullet Casing (9mm)",
    collectedBy: 4,
    dateCollected: "2025-05-03",
    location: "Ballistics Lab",
    status: "Processing",
    chain: [
      { officer: 4, action: "Collected", timestamp: "2025-05-03 20:15" },
      {
        officer: 9,
        action: "Submitted to Ballistics",
        timestamp: "2025-05-04 09:00",
      },
    ],
  },
  {
    id: "EV-007",
    caseId: "C-004",
    type: "Physical",
    description: "DNA Sample",
    collectedBy: 4,
    dateCollected: "2025-05-03",
    location: "DNA Lab",
    status: "Processing",
    chain: [
      { officer: 4, action: "Collected", timestamp: "2025-05-03 21:00" },
      { officer: 4, action: "Submitted to Lab", timestamp: "2025-05-04 09:30" },
    ],
  },
  {
    id: "EV-008",
    caseId: "C-005",
    type: "Physical",
    description: "Drug Sample (Cocaine)",
    collectedBy: 5,
    dateCollected: "2025-04-25",
    location: "Evidence Locker B",
    status: "Analyzed",
    chain: [
      { officer: 5, action: "Seized", timestamp: "2025-04-25 23:10" },
      {
        officer: 5,
        action: "Tagged and Bagged",
        timestamp: "2025-04-25 23:30",
      },
      { officer: 19, action: "Lab Analysis", timestamp: "2025-04-26 11:45" },
      { officer: 5, action: "Results Received", timestamp: "2025-04-28 14:20" },
    ],
  },
  {
    id: "EV-009",
    caseId: "C-008",
    type: "Physical",
    description: "Shell Casings (5.56mm)",
    collectedBy: 8,
    dateCollected: "2025-04-29",
    location: "Ballistics Lab",
    status: "Analyzed",
    chain: [
      { officer: 8, action: "Collected", timestamp: "2025-04-29 22:40" },
      {
        officer: 8,
        action: "Submitted to Ballistics",
        timestamp: "2025-04-30 08:15",
      },
      {
        officer: 9,
        action: "Analysis Complete",
        timestamp: "2025-05-02 16:30",
      },
    ],
  },
  {
    id: "EV-010",
    caseId: "C-021",
    type: "Digital",
    description: "Bank Security Footage",
    collectedBy: 17,
    dateCollected: "2025-05-08",
    location: "Digital Storage Server",
    status: "Processing",
    chain: [
      { officer: 17, action: "Acquired", timestamp: "2025-05-08 10:30" },
      {
        officer: 17,
        action: "Upload to System",
        timestamp: "2025-05-08 11:45",
      },
    ],
  },
];

export default function IncidentEvidenceTracker() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filteredEvidence, setFilteredEvidence] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [caseList, setCaseList] = useState([]);
  const [isChainOpen, setIsChainOpen] = useState({});

  useEffect(() => {
    // Sort and filter cases to only those with evidence
    const caseIdsWithEvidence = [
      ...new Set(evidenceItems.map((item) => item.caseId)),
    ];
    const filteredCases = cases
      .filter((c) => caseIdsWithEvidence.includes(c.caseId))
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    setCaseList(filteredCases);

    // Set default selected case to the most recent one
    if (filteredCases.length > 0 && !selectedCase) {
      setSelectedCase(filteredCases[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedCase) {
      filterEvidenceItems();
    }
  }, [selectedCase, searchTerm, filterType]);

  const filterEvidenceItems = () => {
    if (!selectedCase) return;

    let filtered = evidenceItems.filter(
      (item) => item.caseId === selectedCase.caseId
    );

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "All") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    setFilteredEvidence(filtered);
  };

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setSelectedEvidence(null);
  };

  const handleEvidenceSelect = (evidence) => {
    setSelectedEvidence(evidence);
  };

  const getOfficerName = (id) => {
    const officer = officers.find((off) => off.id === id);
    return officer ? officer.name : "Unknown Officer";
  };

  const toggleChain = (id) => {
    setIsChainOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      Processing: "bg-yellow-100 text-yellow-800",
      Analyzed: "bg-blue-100 text-blue-800",
      Filed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-green-500 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center">
          <Database className="mr-2" size={24} />
          Incident and Evidence Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-white text-green-700 px-4 py-2 rounded-md flex items-center text-sm font-medium hover:bg-green-50">
            <Calendar className="mr-2" size={16} />
            Activity Log
          </button>
          <button className="bg-white text-green-700 px-4 py-2 rounded-md flex items-center text-sm font-medium hover:bg-green-50">
            <FileText className="mr-2" size={16} />
            Generate Report
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Case List Sidebar */}
        <div className="w-72 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Cases</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search cases..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {caseList.map((caseItem) => (
              <div
                key={caseItem.caseId}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition ${
                  selectedCase?.caseId === caseItem.caseId
                    ? "bg-green-50 border-l-4 border-green-500"
                    : ""
                }`}
                onClick={() => handleCaseSelect(caseItem)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {caseItem.caseId}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {caseItem.title}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      caseItem.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : caseItem.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Updated: {caseItem.lastUpdated}</span>
                  <span>
                    Evidence:{" "}
                    {
                      evidenceItems.filter((e) => e.caseId === caseItem.caseId)
                        .length
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedCase ? (
            <>
              {/* Case Detail Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-medium text-gray-800">
                      {selectedCase.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedCase.caseId} · {selectedCase.category} · Assigned
                      to: {getOfficerName(selectedCase.assignedTo)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedCase.priority === "Critical"
                          ? "bg-red-100 text-red-800"
                          : selectedCase.priority === "High"
                          ? "bg-orange-100 text-orange-800"
                          : selectedCase.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedCase.priority}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedCase.status === "Open"
                          ? "bg-green-100 text-green-800"
                          : selectedCase.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedCase.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="border-b border-gray-200 px-6 py-3 flex space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search evidence..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={16}
                  />
                </div>
                <div className="relative">
                  <select
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm appearance-none bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Physical">Physical</option>
                    <option value="Digital">Digital</option>
                  </select>
                  <Filter
                    className="absolute right-2 top-2.5 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
                <button className="bg-green-100 text-green-700 px-3 py-2 rounded-md flex items-center text-sm font-medium hover:bg-green-200">
                  <ArrowUpDown className="mr-1" size={16} />
                  Sort
                </button>
              </div>

              {/* Evidence List and Detail Split View */}
              <div className="flex-1 flex overflow-hidden">
                {/* Evidence List */}
                <div className="w-1/2 overflow-y-auto border-r border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {filteredEvidence.length > 0 ? (
                      filteredEvidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${
                            selectedEvidence?.id === evidence.id
                              ? "bg-green-50"
                              : ""
                          }`}
                          onClick={() => handleEvidenceSelect(evidence)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {evidence.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                {evidence.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              {renderStatusBadge(evidence.status)}
                              <span
                                className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                                  evidence.type === "Physical"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {evidence.type}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>Collected: {evidence.dateCollected}</span>
                            <span>
                              By: {getOfficerName(evidence.collectedBy)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <button
                              className="text-green-600 text-sm flex items-center hover:text-green-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChain(evidence.id);
                              }}
                            >
                              {isChainOpen[evidence.id] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                              Chain of Custody
                            </button>
                            {isChainOpen[evidence.id] && (
                              <div className="mt-2 pl-5 border-l-2 border-green-200 space-y-2">
                                {evidence.chain.map((entry, idx) => (
                                  <div key={idx} className="text-xs">
                                    <div className="text-gray-500">
                                      {entry.timestamp}
                                    </div>
                                    <div className="font-medium">
                                      {entry.action}
                                    </div>
                                    <div className="text-gray-600">
                                      {getOfficerName(entry.officer)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500">
                        <p>No evidence found for the selected criteria.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evidence Detail */}
                <div className="w-1/2 overflow-y-auto bg-gray-50">
                  {selectedEvidence ? (
                    <div className="p-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Evidence Detail
                          </h3>
                          {renderStatusBadge(selectedEvidence.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500">Evidence ID</p>
                            <p className="font-medium">{selectedEvidence.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">
                              {selectedEvidence.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Collected Date
                            </p>
                            <p className="font-medium">
                              {selectedEvidence.dateCollected}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Collected By
                            </p>
                            <p className="font-medium">
                              {getOfficerName(selectedEvidence.collectedBy)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Storage Location
                            </p>
                            <p className="font-medium">
                              {selectedEvidence.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Case Number</p>
                            <p className="font-medium">
                              {selectedEvidence.caseId}
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="mt-1">{selectedEvidence.description}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <span>Chain of Custody</span>
                            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {selectedEvidence.chain.length} entries
                            </span>
                          </h4>
                          <div className="border border-gray-200 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Officer
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedEvidence.chain.map((entry, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                      {entry.timestamp}
                                    </td>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                      {entry.action}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                      {getOfficerName(entry.officer)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                            Print Details
                          </button>
                          <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                            Update Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No Evidence Selected
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Select an evidence item to view detailed information.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-6">
                <Database className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No Case Selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a case to view evidence information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
