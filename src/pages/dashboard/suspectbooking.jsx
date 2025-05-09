import { useState, useEffect } from "react";
import {
  Search,
  User,
  FileText,
  Clock,
  Camera,
  Fingerprint,
  AlertCircle,
  Clipboard,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";
import { officers, departments, cases, suspects } from "../../data/data";

// Additional data for the booking system
const bookingStatuses = [
  "Processing",
  "Pending Review",
  "Completed",
  "Released",
  "Transferred",
];

const detentionFacilities = [
  "Main County Jail",
  "Central Holding",
  "North District Detention",
  "Juvenile Detention Center",
  "State Correctional Facility",
];

const charges = [
  "Burglary",
  "Assault",
  "Drug Possession",
  "Theft",
  "Fraud",
  "Robbery",
  "Domestic Violence",
  "DUI",
  "Weapons Possession",
  "Vandalism",
  "Identity Theft",
  "Cybercrime",
];

const SuspectBookingSystem = () => {
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuspects, setFilteredSuspects] = useState([]);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    officerId: "",
    facility: "",
    bookingDate: new Date().toISOString().split("T")[0],
    status: "Processing",
    charges: [],
    notes: "",
    releaseDate: "",
    courtDate: "",
  });
  const [expandedSection, setExpandedSection] = useState("personal");
  const [selectedCharge, setSelectedCharge] = useState("");

  useEffect(() => {
    setFilteredSuspects(
      suspects.filter(
        (suspect) =>
          suspect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          suspect.criminalRecord.some((record) =>
            record.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          suspect.associatedCases.some((caseId) =>
            caseId.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }, [searchTerm]);

  const handleSelectSuspect = (suspect) => {
    setSelectedSuspect(suspect);
    setShowNewBooking(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddCharge = () => {
    if (selectedCharge && !bookingDetails.charges.includes(selectedCharge)) {
      setBookingDetails({
        ...bookingDetails,
        charges: [...bookingDetails.charges, selectedCharge],
      });
      setSelectedCharge("");
    }
  };

  const handleRemoveCharge = (charge) => {
    setBookingDetails({
      ...bookingDetails,
      charges: bookingDetails.charges.filter((c) => c !== charge),
    });
  };

  const handleSaveBooking = () => {
    // In a real system, this would save to a database
    alert("Booking saved successfully!");
    setShowNewBooking(false);
    // Reset form
    setBookingDetails({
      officerId: "",
      facility: "",
      bookingDate: new Date().toISOString().split("T")[0],
      status: "Processing",
      charges: [],
      notes: "",
      releaseDate: "",
      courtDate: "",
    });
  };

  const getAssociatedCaseDetails = (caseIds) => {
    return caseIds.map((caseId) => {
      const caseDetail = cases.find((c) => c.caseId === caseId);
      return caseDetail ? caseDetail : { caseId, title: "Unknown Case" };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white p-4 shadow-md flex flex-col">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search suspects..."
              className="w-full p-2 pl-8 border border-gray-300 rounded"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-2 top-2.5 text-gray-400"
              size={16}
            />
          </div>

          <button
            className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
            onClick={() => setShowNewBooking(true)}
          >
            <span>New Booking</span>
          </button>

          <div className="flex-1 overflow-y-auto">
            <h2 className="font-semibold mb-2 text-gray-600">
              Recent Suspects
            </h2>
            <div className="space-y-2">
              {filteredSuspects.map((suspect) => (
                <div
                  key={suspect.id}
                  className={`p-2 rounded cursor-pointer transition-colors flex items-center ${
                    selectedSuspect?.id === suspect.id
                      ? "bg-green-100 border-l-4 border-green-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectSuspect(suspect)}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{suspect.name}</p>
                    <p className="text-xs text-gray-500">
                      {suspect.status} • {suspect.associatedCases.length} cases
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selectedSuspect && !showNewBooking ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSuspect.name}</h2>
                  <p className="text-gray-500">
                    ID: #{selectedSuspect.id} • Status:{" "}
                    <span
                      className={`${
                        selectedSuspect.status === "Wanted"
                          ? "text-red-500"
                          : selectedSuspect.status === "In Custody"
                          ? "text-orange-500"
                          : "text-blue-500"
                      }`}
                    >
                      {selectedSuspect.status}
                    </span>
                  </p>
                </div>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                  onClick={() => setShowNewBooking(true)}
                >
                  Book Suspect
                </button>
              </div>

              {/* Collapsible sections */}
              <div className="space-y-4">
                {/* Personal Information */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("personal")}
                  >
                    <div className="flex items-center">
                      <User className="text-green-500 mr-2" size={20} />
                      <h3 className="font-semibold">Personal Information</h3>
                    </div>
                    {expandedSection === "personal" ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>

                  {expandedSection === "personal" && (
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p>{selectedSuspect.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p>{selectedSuspect.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Last Known Location
                        </p>
                        <p>{selectedSuspect.lastKnownLocation}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Description</p>
                        <p>{selectedSuspect.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Criminal Record */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("record")}
                  >
                    <div className="flex items-center">
                      <FileText className="text-green-500 mr-2" size={20} />
                      <h3 className="font-semibold">Criminal Record</h3>
                    </div>
                    {expandedSection === "record" ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>

                  {expandedSection === "record" && (
                    <div className="p-4">
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedSuspect.criminalRecord.map((record, index) => (
                          <li key={index}>{record}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Associated Cases */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("cases")}
                  >
                    <div className="flex items-center">
                      <Clipboard className="text-green-500 mr-2" size={20} />
                      <h3 className="font-semibold">Associated Cases</h3>
                    </div>
                    {expandedSection === "cases" ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>

                  {expandedSection === "cases" && (
                    <div className="p-4">
                      <div className="space-y-2">
                        {getAssociatedCaseDetails(
                          selectedSuspect.associatedCases
                        ).map((caseDetail) => (
                          <div
                            key={caseDetail.caseId}
                            className="p-2 bg-gray-50 rounded"
                          >
                            <p className="font-medium">
                              {caseDetail.caseId}: {caseDetail.title}
                            </p>
                            {caseDetail.status && (
                              <p className="text-sm text-gray-500">
                                Status: {caseDetail.status} • Priority:{" "}
                                {caseDetail.priority}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Biometric Information (placeholder) */}
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection("biometric")}
                  >
                    <div className="flex items-center">
                      <Fingerprint className="text-green-500 mr-2" size={20} />
                      <h3 className="font-semibold">Biometric Information</h3>
                    </div>
                    {expandedSection === "biometric" ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>

                  {expandedSection === "biometric" && (
                    <div className="p-4">
                      <div className="flex justify-between mb-4">
                        <div className="w-1/2 border rounded p-4 mr-2 flex flex-col items-center">
                          <Camera size={40} className="text-gray-400 mb-2" />
                          <p className="text-center text-gray-500">Mugshot</p>
                          <button className="mt-2 text-sm text-green-500 hover:underline">
                            Capture New
                          </button>
                        </div>
                        <div className="w-1/2 border rounded p-4 ml-2 flex flex-col items-center">
                          <Fingerprint
                            size={40}
                            className="text-gray-400 mb-2"
                          />
                          <p className="text-center text-gray-500">
                            Fingerprints
                          </p>
                          <button className="mt-2 text-sm text-green-500 hover:underline">
                            Scan New
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Biometric identification verified on{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : showNewBooking ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  New Booking {selectedSuspect && `- ${selectedSuspect.name}`}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewBooking(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <User className="mr-2 text-green-500" size={18} />
                    Suspect Information
                  </h3>

                  {selectedSuspect ? (
                    <div className="bg-gray-50 p-4 rounded mb-4">
                      <p className="font-medium">{selectedSuspect.name}</p>
                      <p className="text-sm text-gray-500">
                        ID: #{selectedSuspect.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedSuspect.age} years old,{" "}
                        {selectedSuspect.gender}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {selectedSuspect.status}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4 flex items-start">
                      <AlertCircle
                        className="text-yellow-500 mr-2 flex-shrink-0 mt-1"
                        size={18}
                      />
                      <p className="text-sm">
                        No suspect selected. Please select a suspect from the
                        list or search for one.
                      </p>
                    </div>
                  )}

                  <h3 className="font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 text-green-500" size={18} />
                    Booking Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Officer
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.officerId}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            officerId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Officer</option>
                        {officers.map((officer) => (
                          <option key={officer.id} value={officer.id}>
                            {officer.name} ({officer.badgeNumber})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detention Facility
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.facility}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            facility: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Facility</option>
                        {detentionFacilities.map((facility, index) => (
                          <option key={index} value={facility}>
                            {facility}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.bookingDate}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            bookingDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.status}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            status: e.target.value,
                          })
                        }
                      >
                        {bookingStatuses.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <FileText className="mr-2 text-green-500" size={18} />
                    Charges and Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add Charges
                      </label>
                      <div className="flex">
                        <select
                          className="flex-1 p-2 border border-gray-300 rounded-l focus:ring-green-500 focus:border-green-500"
                          value={selectedCharge}
                          onChange={(e) => setSelectedCharge(e.target.value)}
                        >
                          <option value="">Select Charge</option>
                          {charges.map((charge, index) => (
                            <option key={index} value={charge}>
                              {charge}
                            </option>
                          ))}
                        </select>
                        <button
                          className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600 transition-colors"
                          onClick={handleAddCharge}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Charges
                      </label>
                      {bookingDetails.charges.length > 0 ? (
                        <div className="bg-gray-50 p-2 rounded border border-gray-200">
                          <ul className="space-y-1">
                            {bookingDetails.charges.map((charge, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded"
                              >
                                <span>{charge}</span>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveCharge(charge)}
                                >
                                  <X size={16} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No charges added
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Court Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.courtDate}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            courtDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Projected Release Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        value={bookingDetails.releaseDate}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            releaseDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 h-24"
                        value={bookingDetails.notes}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Enter any additional notes about this booking..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => setShowNewBooking(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center"
                  onClick={handleSaveBooking}
                >
                  <Save size={18} className="mr-1" />
                  Save Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText size={64} className="mb-4" />
              <h2 className="text-xl font-medium mb-2">No Suspect Selected</h2>
              <p>
                Select a suspect from the list to view details or create a new
                booking.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuspectBookingSystem;
