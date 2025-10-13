import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import apiService from "../../../services/apiService";

const PinslotManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pinslots, setPinslots] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPinslots, setFilteredPinslots] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Get station filter from URL params
  const filterStationId = searchParams.get('stationId');
  const filterStationName = searchParams.get('stationName');
  const [isStationFiltered, setIsStationFiltered] = useState(false);

  // Update isStationFiltered based on URL params
  useEffect(() => {
    setIsStationFiltered(!!filterStationId);
  }, [filterStationId]);

  // Single useEffect for initial data loading - NO DEPENDENCIES ISSUES
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounted
    
    const initializeData = async () => {
      try {
        console.log("🚀 Initializing PinslotManagement data...");
        setLoading(true);
        setError(null);
        
        // Step 1: Load stations first
        console.log("📡 Loading stations...");
        const stationsResponse = await apiService.getPinStations();
        
        if (!isMounted) return; // Component unmounted, stop execution
        
        const transformedStations = stationsResponse.data.map((station) => ({
          id: station.stationID,
          stationId: station.stationID,
          name: station.stationName,
          location: station.location,
          status: station.status,
        }));
        
        console.log("✅ Stations loaded:", transformedStations.length);
        setStations(transformedStations);
        
        // Step 2: Load pinslots
        console.log("📡 Loading pinslots...");
        const pinslotsResponse = await apiService.getPinslots();
        
        if (!isMounted) return; // Component unmounted, stop execution
        
        // Step 3: Transform pinslots with actual station names (not fallback)
        const transformedPinslots = pinslotsResponse.data.map((pinslot) => {
          const station = transformedStations.find(s => s.stationId === pinslot.stationID);
          return {
            id: pinslot.pinID,
            pinId: pinslot.pinID,
            pinPercent: pinslot.pinPercent,
            pinHealth: pinslot.pinHealth,
            pinStatus: pinslot.pinStatus,
            status: pinslot.status,
            userId: pinslot.userID,
            stationId: pinslot.stationID,
            stationName: station ? station.name : `Trạm ${pinslot.stationID}` // Use actual name immediately
          };
        });
        
              // Step 4: Apply station filtering if needed
              let finalPinslots = transformedPinslots;
              if (filterStationId) {
                console.log(`🔍 Filtering pinslots for station ID: ${filterStationId}`);
                finalPinslots = transformedPinslots.filter(pinslot => 
                  pinslot.stationId.toString() === filterStationId.toString()
                );
                setIsStationFiltered(true);
                console.log(`✅ Filtered pinslots: ${finalPinslots.length} of ${transformedPinslots.length}`);
              }
              
              // Step 5: Apply initial sorting
              const sortedPinslots = sortPinslots(finalPinslots, sortOrder);
              
              console.log("✅ Pinslots loaded and transformed:", sortedPinslots.length);
              setPinslots(sortedPinslots);
        
      } catch (err) {
        console.error("❌ Error loading data:", err);
        if (isMounted) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initializeData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Helper function to sort pinslots by creation time
  const sortPinslots = (pinslotsArray, order = "newest") => {
    return [...pinslotsArray].sort((a, b) => {
      // Sort by pinID as a proxy for creation time (assuming higher ID = newer)
      if (order === "newest") {
        return b.pinId - a.pinId; // Descending (newest first)
      } else {
        return a.pinId - b.pinId; // Ascending (oldest first)
      }
    });
  };

  const refreshPinslots = async () => {
    try {
      console.log("🔄 Refreshing pinslots data...");
      setLoading(true);
      setError(null);
      
      // Clear station filter when refreshing
      if (filterStationId) {
        console.log("🧹 Clearing station filter on refresh");
        // Clear URL params by navigating to clean URL
        navigate('/admin-pinslot-management', { replace: true });
      }
      
      // Step 1: Reload stations
      const stationsResponse = await apiService.getPinStations();
      const transformedStations = stationsResponse.data.map((station) => ({
        id: station.stationID,
        stationId: station.stationID,
        name: station.stationName,
        location: station.location,
        status: station.status,
      }));
      setStations(transformedStations);
      
      // Step 2: Reload pinslots with correct station names
      const pinslotsResponse = await apiService.getPinslots();
      const transformedPinslots = pinslotsResponse.data.map((pinslot) => {
        const station = transformedStations.find(s => s.stationId === pinslot.stationID);
        return {
          id: pinslot.pinID,
          pinId: pinslot.pinID,
          pinPercent: pinslot.pinPercent,
          pinHealth: pinslot.pinHealth,
          pinStatus: pinslot.pinStatus,
          status: pinslot.status,
          userId: pinslot.userID,
          stationId: pinslot.stationID,
          stationName: station ? station.name : `Trạm ${pinslot.stationID}`
        };
      });
      
      // Step 3: NO station filtering on refresh - show all pinslots
      console.log("📋 Loading all pinslots (no filter)");
      
      // Step 4: Apply current sorting
      const sortedPinslots = sortPinslots(transformedPinslots, sortOrder);
      setPinslots(sortedPinslots);
      
      // Step 5: Clear any existing search
      if (searchQuery) {
        console.log("🧹 Clearing search on refresh");
        setSearchQuery("");
        setIsSearching(false);
        setFilteredPinslots([]);
      }
      
      console.log("✅ Pinslots refreshed successfully - showing all pinslots");
    } catch (err) {
      console.error("❌ Error refreshing pinslots:", err);
      setError("Không thể tải lại dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };


  const handleSortChange = (newSortOrder) => {
    console.log("🔄 Sorting pinslots:", newSortOrder);
    setSortOrder(newSortOrder);
    setShowSortDropdown(false);
    
    // Simply sort current pinslots (they already have correct station names)
    const sortedPinslots = sortPinslots(pinslots, newSortOrder);
    setPinslots(sortedPinslots);
    
    // Re-apply search if there was one
    if (searchQuery) {
      const filtered = sortedPinslots.filter(pinslot => 
        pinslot.stationName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPinslots(filtered);
    }
  };

  const getSortLabel = () => {
    return sortOrder === "newest" ? "Mới nhất" : "Cũ nhất";
  };

  const getSortIcon = () => {
    return sortOrder === "newest" ? "↓" : "↑";
  };

  // Search function
  const handleSearch = (query) => {
    console.log("🔍 Searching pinslots:", query);
    setSearchQuery(query);
    
    if (!query.trim()) {
      setIsSearching(false);
      setFilteredPinslots([]);
      return;
    }

    setIsSearching(true);
    
    // Filter pinslots by station name (they already have correct names)
    const filtered = pinslots.filter(pinslot => 
      pinslot.stationName.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPinslots(filtered);
  };

  const clearSearch = () => {
    console.log("🗑️ Clearing search");
    setSearchQuery("");
    setIsSearching(false);
    setFilteredPinslots([]);
  };

  // Get current pinslots to display (filtered or all)
  const getCurrentPinslots = () => {
    return isSearching ? filteredPinslots : pinslots;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Tạm ngưng";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPinStatusText = (pinStatus) => {
    switch (pinStatus) {
      case 1:
        return "Sẵn sàng";
      case 0:
        return "Đang sạc";
      default:
        return "Không xác định";
    }
  };

  const getPinStatusColor = (pinStatus) => {
    switch (pinStatus) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPercentColor = (percent) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        <AdminHeader
          title={isStationFiltered ? `Pin Slot - ${filterStationName || `Trạm ${filterStationId}`}` : "Quản lý Pin Slot"}
          subtitle={isStationFiltered 
            ? `Danh sách pin slot của ${filterStationName || `Trạm ${filterStationId}`}` 
            : "Quản lý và theo dõi tất cả các pin slot trong hệ thống"
          }
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          stats={[
            { label: "Tổng pin slot", value: getCurrentPinslots().length, color: "bg-blue-400" },
            { label: "Đang hoạt động", value: getCurrentPinslots().filter(p => p.status === 1).length, color: "bg-green-400" },
            { label: "Đang sạc", value: getCurrentPinslots().filter(p => p.pinStatus === "charging").length, color: "bg-yellow-400" },
            { label: "Sẵn sàng", value: getCurrentPinslots().filter(p => p.pinStatus === "available").length, color: "bg-purple-400" }
          ]}
        />

        {/* Main Content */}
        <div className="mt-8">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isStationFiltered 
                  ? `Pin Slot - ${filterStationName || `Trạm ${filterStationId}`}` 
                  : isSearching 
                    ? `Kết quả tìm kiếm` 
                    : "Danh sách Pin Slot"
                }
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getCurrentPinslots().length} pin slot
              </span>
              {isStationFiltered && (
                <button
                  onClick={() => navigate('/admin-station-management')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Quay lại danh sách trạm</span>
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="flex-1 max-w-lg mx-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên trạm..."
                  className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base text-gray-700 placeholder-gray-400 bg-white shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Sort Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg group"
                >
                  <svg className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  <span className="text-sm font-medium">{getSortLabel()}</span>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Custom Dropdown */}
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => handleSortChange("newest")}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                          sortOrder === "newest" ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500" : "text-gray-700"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          sortOrder === "newest" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Mới nhất</div>                       
                        </div>
                        {sortOrder === "newest" && (
                          <div className="ml-auto">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSortChange("oldest")}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                          sortOrder === "oldest" ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500" : "text-gray-700"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          sortOrder === "oldest" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Cũ nhất</div>
                        </div>
                        {sortOrder === "oldest" && (
                          <div className="ml-auto">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Backdrop to close dropdown */}
                {showSortDropdown && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSortDropdown(false)}
                  ></div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshPinslots}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Tải lại</span>
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {isSearching && (
            <div className="mb-4 flex items-center space-x-2 text-sm bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-700 font-medium">
                Tìm thấy {filteredPinslots.length} pin slot cho "{searchQuery}"
              </span>
              {filteredPinslots.length === 0 && (
                <span className="text-gray-500">- Thử tìm kiếm với từ khóa khác</span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Pinslots Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentPinslots().map((pinslot) => (
                <div
                  key={pinslot.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Pin ID: {pinslot.pinId}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {pinslot.stationName}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          pinslot.status
                        )}`}
                      >
                        {getStatusText(pinslot.status)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Pin Percent */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Pin Percent
                      </span>
                      <span
                        className={`text-lg font-bold ${getPercentColor(
                          pinslot.pinPercent
                        )}`}
                      >
                        {pinslot.pinPercent}%
                      </span>
                    </div>

                    {/* Pin Health */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Pin Health
                      </span>
                      <span
                        className={`text-lg font-bold ${getHealthColor(
                          pinslot.pinHealth
                        )}`}
                      >
                        {pinslot.pinHealth}%
                      </span>
                    </div>

                    {/* Pin Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Trạng thái Pin
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPinStatusColor(
                          pinslot.pinStatus
                        )}`}
                      >
                        {getPinStatusText(pinslot.pinStatus)}
                      </span>
                    </div>

                    {/* Station ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Station ID
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {pinslot.stationId}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && getCurrentPinslots().length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isSearching ? "Không tìm thấy kết quả" : "Không có pin slot nào"}
              </h3>
              <p className="text-gray-500">
                {isSearching 
                  ? `Không tìm thấy pin slot nào cho "${searchQuery}". Thử tìm kiếm với từ khóa khác.`
                  : "Hiện tại chưa có pin slot nào trong hệ thống."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PinslotManagement;
