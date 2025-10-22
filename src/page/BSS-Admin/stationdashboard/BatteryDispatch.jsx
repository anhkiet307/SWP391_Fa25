import React, { useState, useEffect } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminBatteryDispatch = () => {
  const [formData, setFormData] = useState({
    // Trạm nguồn
    sourceStation: "",
    sourcePinSlot: "",
    sourcePinPercent: "",
    sourcePinHealth: "",
    // Trạm đích
    targetStation: "",
    targetPinSlot: "",
    targetPinPercent: "",
    targetPinHealth: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  // Station selection states
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [showSourceStationModal, setShowSourceStationModal] = useState(false);
  const [showTargetStationModal, setShowTargetStationModal] = useState(false);
  const [selectedSourceStation, setSelectedSourceStation] = useState(null);
  const [selectedTargetStation, setSelectedTargetStation] = useState(null);
  
  // Pin slot selection states
  const [showSourcePinSlotModal, setShowSourcePinSlotModal] = useState(false);
  const [showTargetPinSlotModal, setShowTargetPinSlotModal] = useState(false);
  const [selectedSourcePinSlot, setSelectedSourcePinSlot] = useState(null);
  const [selectedTargetPinSlot, setSelectedTargetPinSlot] = useState(null);

  // Dispatch state
  const [isDispatching, setIsDispatching] = useState(false);

  // Pin slots state
  const [sourcePinSlots, setSourcePinSlots] = useState([]);
  const [targetPinSlots, setTargetPinSlots] = useState([]);
  const [sourcePinSlotsLoading, setSourcePinSlotsLoading] = useState(false);
  const [targetPinSlotsLoading, setTargetPinSlotsLoading] = useState(false);

  // Load stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        setStationsLoading(true);
        const response = await apiService.getPinStations();
        
        // Transform API data to match UI format
        const transformedStations = response.data.map((station) => ({
          id: station.stationID,
          stationId: station.stationID.toString(),
          name: station.stationName,
          location: station.location,
          status: station.status === 1 ? "active" : "maintenance",
          createdAt: station.createAt,
          x: station.x,
          y: station.y,
        }));
        
        setStations(transformedStations);
      } catch (err) {
        console.error("Error loading stations:", err);
        showError("Không thể tải danh sách trạm!");
      } finally {
        setStationsLoading(false);
      }
    };

    loadStations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Pin slot selection handlers
  const handleSourcePinSlotSelect = (pinSlot) => {
    setSelectedSourcePinSlot(pinSlot);
    setFormData(prev => ({
      ...prev,
      sourcePinSlot: pinSlot.id.toString(),
      sourcePinPercent: pinSlot.pinPercent.toString(),
      sourcePinHealth: pinSlot.pinHealth.toString(),
    }));
    setShowSourcePinSlotModal(false);
  };

  const handleTargetPinSlotSelect = (pinSlot) => {
    setSelectedTargetPinSlot(pinSlot);
    setFormData(prev => ({
      ...prev,
      targetPinSlot: pinSlot.id.toString(),
      targetPinPercent: pinSlot.pinPercent.toString(),
      targetPinHealth: pinSlot.pinHealth.toString(),
    }));
    setShowTargetPinSlotModal(false);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };


  // Load pin slots for a specific station
  const loadPinSlotsForStation = async (stationId, isSource = true) => {
    try {
      if (isSource) {
        setSourcePinSlotsLoading(true);
      } else {
        setTargetPinSlotsLoading(true);
      }

      const response = await apiService.getPinslotsByStation(stationId);
      
      // Transform API data to match UI format
      const transformedPinSlots = response.data.map((pinSlot) => ({
        id: pinSlot.pinID,
        pinId: pinSlot.pinID,
        pinPercent: pinSlot.pinPercent,
        pinHealth: pinSlot.pinHealth,
        pinStatus: pinSlot.pinStatus,
        status: pinSlot.status,
        userId: pinSlot.userID,
        stationId: pinSlot.stationID,
      }));

      if (isSource) {
        setSourcePinSlots(transformedPinSlots);
      } else {
        setTargetPinSlots(transformedPinSlots);
      }
    } catch (err) {
      console.error("Error loading pin slots:", err);
      showError("Không thể tải danh sách pin slot!");
    } finally {
      if (isSource) {
        setSourcePinSlotsLoading(false);
      } else {
        setTargetPinSlotsLoading(false);
      }
    }
  };

  // Station selection handlers
  const handleSourceStationSelect = (station) => {
    if (station.status === "maintenance") return; // Không cho chọn trạm bảo dưỡng
    
    setSelectedSourceStation(station);
    setSelectedSourcePinSlot(null); // Reset selected pin slot
    setFormData(prev => ({
      ...prev,
      sourceStation: station.id,
      sourcePinSlot: "", // Reset pin slot khi đổi trạm
      sourcePinPercent: "", // Reset pin percent
      sourcePinHealth: "", // Reset pin health
    }));
    setShowSourceStationModal(false);
    
    // Load pin slots for selected station
    loadPinSlotsForStation(station.id, true);
  };

  const handleTargetStationSelect = (station) => {
    if (station.status === "maintenance") return; // Không cho chọn trạm bảo dưỡng
    
    setSelectedTargetStation(station);
    setSelectedTargetPinSlot(null); // Reset selected pin slot
    setFormData(prev => ({
      ...prev,
      targetStation: station.id,
      targetPinSlot: "", // Reset pin slot khi đổi trạm
      targetPinPercent: "", // Reset pin percent
      targetPinHealth: "", // Reset pin health
    }));
    setShowTargetStationModal(false);
    
    // Load pin slots for selected station
    loadPinSlotsForStation(station.id, false);
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  // ===== BUSINESS LOGIC VALIDATION =====
  // Kiểm tra các quy tắc nghiệp vụ trước khi điều phối pin
  const validateDispatch = (source, target) => {
    // Rule 1: Không cho phép điều phối cùng một pin slot
    // Ví dụ: Pin 139 không thể điều phối với chính Pin 139
    if (source.pinId === target.pinId) {
      throw new Error(`Không thể điều phối cùng một pin slot (Pin ${source.pinId})!`);
    }

    // Rule 2: Kiểm tra trạng thái pin - chỉ điều phối pin đang hoạt động
    // Ví dụ: Pin có status = 0 (bảo trì) không thể điều phối
    if (source.status !== 1 || target.status !== 1) {
      throw new Error("Chỉ có thể điều phối pin đang hoạt động (status = 1)!");
    }

    // Rule 3: Kiểm tra pin health tối thiểu - tránh điều phối pin quá yếu
    // Ví dụ: Pin có health 15% không thể điều phối (quá yếu, nguy hiểm)
    if (source.pinHealth < 20 || target.pinHealth < 20) {
      throw new Error(`Không thể điều phối pin có health < 20%! 
        Pin ${source.pinId}: ${source.pinHealth}%, Pin ${target.pinId}: ${target.pinHealth}% 
        (Pin yếu có thể phát nổ khi nhận dòng điện cao)`);
    }

    // Rule 4: Kiểm tra chênh lệch pin health - tránh shock hệ thống
    // Ví dụ: Pin 90% health vs Pin 15% health = chênh lệch 75% > 70% → Nguy hiểm!
    const healthDiff = Math.abs(source.pinHealth - target.pinHealth);
    if (healthDiff > 70) {
      throw new Error(`Chênh lệch pin health quá lớn: ${healthDiff}% > 70%!
        Pin ${source.pinId}: ${source.pinHealth}% vs Pin ${target.pinId}: ${target.pinHealth}%
        (Có thể gây cháy nổ hoặc hỏng mạch điện)`);
    }

    // Rule 5: Kiểm tra chênh lệch pin percent - đảm bảo tính ổn định
    // Ví dụ: Pin 100% vs Pin 5% = chênh lệch 95% > 80% → Shock điện áp!
    const percentDiff = Math.abs(source.pinPercent - target.pinPercent);
    if (percentDiff > 80) {
      throw new Error(`Chênh lệch pin percent quá lớn: ${percentDiff}% > 80%!
        Pin ${source.pinId}: ${source.pinPercent}% vs Pin ${target.pinId}: ${target.pinPercent}%
        (Có thể gây shock điện áp, hỏng thiết bị điện tử)`);
    }

    // Rule 6: Kiểm tra pin percent tối thiểu - tránh điều phối pin cạn
    // Ví dụ: Pin có 3% không thể điều phối (quá cạn, có thể hỏng vĩnh viễn)
    if (source.pinPercent < 5 || target.pinPercent < 5) {
      throw new Error(`Không thể điều phối pin có percent < 5%!
        Pin ${source.pinId}: ${source.pinPercent}%, Pin ${target.pinId}: ${target.pinPercent}%
        (Pin cạn có thể bị hỏng vĩnh viễn khi sạc lại)`);
    }

    // Rule 7: Kiểm tra logic nghiệp vụ - không nên đổi pin tốt lấy pin xấu
    // Ví dụ: Pin A (90%+85%)/2=87.5% vs Pin B (20%+25%)/2=22.5% = chênh lệch 65% > 60%
    const sourceQuality = (source.pinPercent + source.pinHealth) / 2;
    const targetQuality = (target.pinPercent + target.pinHealth) / 2;
    const qualityDiff = Math.abs(sourceQuality - targetQuality);
    
    if (qualityDiff > 60) {
      throw new Error(`Chất lượng pin chênh lệch quá lớn: ${qualityDiff.toFixed(1)}% > 60%!
        Pin ${source.pinId}: ${sourceQuality.toFixed(1)}% (${source.pinPercent}%+${source.pinHealth}%)/2
        Pin ${target.pinId}: ${targetQuality.toFixed(1)}% (${target.pinPercent}%+${target.pinHealth}%)/2
        (Không hiệu quả: đổi pin tốt lấy pin xấu)`);
    }
  };

  // Handle battery dispatch (swap pin percent and health between two pin slots)
  const handleDispatch = async () => {
    if (!selectedSourcePinSlot || !selectedTargetPinSlot) {
      showError("Vui lòng chọn đầy đủ pin slot nguồn và đích!");
      return;
    }

    try {
      setIsDispatching(true);

      // ===== BUSINESS VALIDATION =====
      // Kiểm tra các quy tắc nghiệp vụ trước khi thực hiện điều phối
      validateDispatch(selectedSourcePinSlot, selectedTargetPinSlot);

      // ===== SINGLE API CALL - PINSLOT SWAP =====
      // Sử dụng API mới: POST /api/pinSlot/swap với query parameters
      // API này sẽ tự động swap pinPercent và pinHealth giữa 2 pin slots
      await apiService.swapPinSlots(
        selectedSourcePinSlot.pinId,
        selectedTargetPinSlot.pinId
      );

      // Success notification
      showSuccess(
        `Điều phối pin thành công! Pin ${selectedSourcePinSlot.pinId} ↔ Pin ${selectedTargetPinSlot.pinId}`
      );

      // ===== SUCCESS CLEANUP =====
      // Đóng preview modal và reset toàn bộ form sau khi thành công
      setShowPreview(false);
      
      // Reset form data về trạng thái ban đầu
      setFormData({
        sourceStation: "",
        sourcePinSlot: "",
        sourcePinPercent: "",
        sourcePinHealth: "",
        targetStation: "",
        targetPinSlot: "",
        targetPinPercent: "",
        targetPinHealth: "",
      });

      // Reset các selected items để chuẩn bị cho lần điều phối tiếp theo
      setSelectedSourceStation(null);
      setSelectedTargetStation(null);
      setSelectedSourcePinSlot(null);
      setSelectedTargetPinSlot(null);
      setSourcePinSlots([]);
      setTargetPinSlots([]);

    } catch (error) {
      console.error("Dispatch error:", error);
      
      // ===== ERROR HANDLING =====
      // Kiểm tra loại lỗi để hiển thị message phù hợp
      if (error.message.includes("Không thể điều phối") || 
          error.message.includes("Chênh lệch") || 
          error.message.includes("Chất lượng")) {
        // Lỗi business validation - hiển thị message cụ thể
        showError(error.message);
      } else {
        // Lỗi technical (network, API, etc.) - hiển thị message chung
        showError("Có lỗi xảy ra khi điều phối pin. Vui lòng thử lại!");
      }
    } finally {
      // ===== CLEANUP =====
      // Luôn reset loading state dù thành công hay thất bại
      setIsDispatching(false);
    }
  };


  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Điều Phối Pin"
          subtitle="Quản lý và điều phối pin giữa các trạm đổi pin"
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          }
          stats={[
            { label: "Điều phối pin", value: "", color: "bg-blue-400" }
          ]}
        />

        {/* Main Content */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Điều phối Pin Slot</h2>
          
          <form onSubmit={handlePreview} className="space-y-8">
            {/* Pin Slot Exchange Layout */}
            <div className="flex items-center justify-center gap-8">
              
              {/* Trạm Nguồn - Left Side */}
              <div className="flex-1 max-w-md">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-lg">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-700">Trạm Nguồn</h3>
                    <p className="text-sm text-emerald-600">Pin slot cần thay thế</p>
              </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Chọn trạm nguồn */}
              <div>
                      <label className="block text-sm font-semibold text-emerald-700 mb-2">
                        Chọn trạm nguồn <span className="text-red-500">*</span>
                </label>
                      <button
                        type="button"
                        onClick={() => setShowSourceStationModal(true)}
                        className="w-full p-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-left flex items-center justify-between hover:border-emerald-300 transition-colors"
                      >
                        <span className={selectedSourceStation ? "text-gray-900" : "text-gray-500"}>
                          {selectedSourceStation ? selectedSourceStation.name : "Chọn trạm nguồn"}
                        </span>
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
              </div>

              {/* Chọn pin slot */}
              <div>
                <label className="block text-sm font-semibold text-emerald-700 mb-2">
                  Chọn Pin Slot <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSourcePinSlotModal(true)}
                  disabled={!selectedSourceStation || sourcePinSlotsLoading}
                  className={`w-full p-3 border-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                    !selectedSourceStation || sourcePinSlotsLoading
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-emerald-200 bg-white hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                >
                  <span className={selectedSourcePinSlot ? "text-gray-900" : "text-gray-500"}>
                    {sourcePinSlotsLoading 
                      ? "Đang tải pin slots..." 
                      : selectedSourcePinSlot 
                        ? `Pin ID: ${selectedSourcePinSlot.pinId} - ${selectedSourcePinSlot.pinPercent}% - Health: ${selectedSourcePinSlot.pinHealth}%`
                        : "Chọn Pin Slot"
                    }
                  </span>
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

                    {/* Pin Percent */}
              <div>
                      <label className="block text-sm font-semibold text-emerald-700 mb-2">
                        Pin Percent (%) <span className="text-red-500">*</span>
                        {formData.sourcePinPercent && (
                          <span className="ml-2 text-xs text-green-600 font-medium">✓ Tự động điền</span>
                        )}
                </label>
                <input
                  type="number"
                        name="sourcePinPercent"
                        value={formData.sourcePinPercent}
                  onChange={handleInputChange}
                        className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          formData.sourcePinPercent ? "border-green-300 bg-green-50" : "border-emerald-200"
                        }`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                  required
                />
              </div>

                    {/* Pin Health */}
              <div>
                      <label className="block text-sm font-semibold text-emerald-700 mb-2">
                        Pin Health (%) <span className="text-red-500">*</span>
                        {formData.sourcePinHealth && (
                          <span className="ml-2 text-xs text-green-600 font-medium">✓ Tự động điền</span>
                        )}
                </label>
                      <input
                        type="number"
                        name="sourcePinHealth"
                        value={formData.sourcePinHealth}
                  onChange={handleInputChange}
                        className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          formData.sourcePinHealth ? "border-green-300 bg-green-50" : "border-emerald-200"
                        }`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                  required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange Arrow - Center */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">ĐIỀU PHỐI</div>
                  <div className="text-xs text-gray-500">Pin Slot</div>
                </div>
              </div>

              {/* Trạm Đích - Right Side */}
              <div className="flex-1 max-w-md">
                <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-lime-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-700">Trạm Đích</h3>
                    <p className="text-sm text-green-600">Pin slot để thay thế</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Chọn trạm đích */}
                    <div>
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Chọn trạm đích <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTargetStationModal(true)}
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-left flex items-center justify-between hover:border-green-300 transition-colors"
                      >
                        <span className={selectedTargetStation ? "text-gray-900" : "text-gray-500"}>
                          {selectedTargetStation ? selectedTargetStation.name : "Chọn trạm đích"}
                        </span>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
              </div>

              {/* Chọn pin slot */}
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Chọn Pin Slot <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowTargetPinSlotModal(true)}
                  disabled={!selectedTargetStation || targetPinSlotsLoading}
                  className={`w-full p-3 border-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                    !selectedTargetStation || targetPinSlotsLoading
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-green-200 bg-white hover:border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  }`}
                >
                  <span className={selectedTargetPinSlot ? "text-gray-900" : "text-gray-500"}>
                    {targetPinSlotsLoading 
                      ? "Đang tải pin slots..." 
                      : selectedTargetPinSlot 
                        ? `Pin ID: ${selectedTargetPinSlot.pinId} - ${selectedTargetPinSlot.pinPercent}% - Health: ${selectedTargetPinSlot.pinHealth}%`
                        : "Chọn Pin Slot"
                    }
                  </span>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
            </div>

                    {/* Pin Percent */}
            <div>
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Pin Percent (%) <span className="text-red-500">*</span>
                        {formData.targetPinPercent && (
                          <span className="ml-2 text-xs text-emerald-600 font-medium">✓ Tự động điền</span>
                        )}
              </label>
                      <input
                        type="number"
                        name="targetPinPercent"
                        value={formData.targetPinPercent}
                onChange={handleInputChange}
                        className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          formData.targetPinPercent ? "border-emerald-300 bg-emerald-50" : "border-green-200"
                        }`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                        required
              />
            </div>

                    {/* Pin Health */}
                    <div>
                      <label className="block text-sm font-semibold text-green-700 mb-2">
                        Pin Health (%) <span className="text-red-500">*</span>
                        {formData.targetPinHealth && (
                          <span className="ml-2 text-xs text-emerald-600 font-medium">✓ Tự động điền</span>
                        )}
                      </label>
                      <input
                        type="number"
                        name="targetPinHealth"
                        value={formData.targetPinHealth}
                        onChange={handleInputChange}
                        className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          formData.targetPinHealth ? "border-emerald-300 bg-emerald-50" : "border-green-200"
                        }`}
                        placeholder="0-100"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 pt-8 border-t border-gray-200">
              <button
                type="button"
                className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Xem trước
              </button>
            </div>
          </form>
        </div>

        {/* Source Pin Slot Selection Modal */}
        {showSourcePinSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chọn Pin Slot Nguồn</h3>
                      <p className="text-sm text-gray-600">Chọn pin slot cần thay thế từ {selectedSourceStation?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSourcePinSlotModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {sourcePinSlotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải danh sách pin slots...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sourcePinSlots.map((pinSlot) => (
                      <div
                        key={pinSlot.id}
                        onClick={() => handleSourcePinSlotSelect(pinSlot)}
                        className="relative p-4 rounded-xl border-2 bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
                      >
                        {/* Pin Slot Info */}
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-base mb-1 text-gray-900">
                              Pin ID: {pinSlot.pinId}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pin Percent:</span>
                                <span className="text-sm font-semibold text-blue-600">{pinSlot.pinPercent}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pin Health:</span>
                                <span className="text-sm font-semibold text-green-600">{pinSlot.pinHealth}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  pinSlot.status === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {pinSlot.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Target Pin Slot Selection Modal */}
        {showTargetPinSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-amber-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chọn Pin Slot Đích</h3>
                      <p className="text-sm text-gray-600">Chọn pin slot để thay thế tại {selectedTargetStation?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTargetPinSlotModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {targetPinSlotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải danh sách pin slots...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {targetPinSlots.map((pinSlot) => (
                      <div
                        key={pinSlot.id}
                        onClick={() => handleTargetPinSlotSelect(pinSlot)}
                        className="relative p-4 rounded-xl border-2 bg-white border-yellow-200 hover:border-yellow-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200"
                      >
                        {/* Pin Slot Info */}
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-base mb-1 text-gray-900">
                              Pin ID: {pinSlot.pinId}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pin Percent:</span>
                                <span className="text-sm font-semibold text-blue-600">{pinSlot.pinPercent}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pin Health:</span>
                                <span className="text-sm font-semibold text-green-600">{pinSlot.pinHealth}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  pinSlot.status === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {pinSlot.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal - Only show when showPreview is true */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-center relative">
                  <h2 className="text-xl font-bold text-gray-900 text-center">
                    Xác nhận điều phối pin
                  </h2>
                  <button
                    onClick={handleEditForm}
                    className="absolute right-0 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Dispatch Icon & Status */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    Điều phối Pin Slot
                  </div>
                  <div className="text-lg text-gray-600">
                    {selectedSourceStation?.name || "Chưa chọn"} → {selectedTargetStation?.name || "Chưa chọn"}
                  </div>
                </div>

                {/* Pin Slot Exchange Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Source Pin Slot Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      </div>
                      <h4 className="text-lg font-bold text-blue-700">Pin Slot Nguồn</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="text-sm font-medium text-blue-600 mb-1">Trạm</div>
                    <div className="text-base font-semibold text-gray-900">
                          {selectedSourceStation?.name || "Chưa chọn"}
                    </div>
                  </div>

                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="text-sm font-medium text-blue-600 mb-1">Pin Slot ID</div>
                    <div className="text-base font-semibold text-gray-900">
                          {selectedSourcePinSlot?.pinId || "Chưa chọn"}
                    </div>
                  </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <div className="text-sm font-medium text-blue-600 mb-1">Pin %</div>
                          <div className="text-base font-semibold text-gray-900">
                            {formData.sourcePinPercent || "0"}%
                          </div>
                    </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <div className="text-sm font-medium text-blue-600 mb-1">Health</div>
                    <div className="text-base font-semibold text-gray-900">
                            {formData.sourcePinHealth || "0"}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Pin Slot Info */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-yellow-700">Pin Slot Đích</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-yellow-100">
                        <div className="text-sm font-medium text-yellow-600 mb-1">Trạm</div>
                    <div className="text-base font-semibold text-gray-900">
                          {selectedTargetStation?.name || "Chưa chọn"}
                    </div>
                  </div>

                      <div className="bg-white rounded-lg p-3 border border-yellow-100">
                        <div className="text-sm font-medium text-yellow-600 mb-1">Pin Slot ID</div>
                    <div className="text-base font-semibold text-gray-900">
                          {selectedTargetPinSlot?.pinId || "Chưa chọn"}
                    </div>
                  </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-3 border border-yellow-100">
                          <div className="text-sm font-medium text-yellow-600 mb-1">Pin %</div>
                          <div className="text-base font-semibold text-gray-900">
                            {formData.targetPinPercent || "0"}%
                          </div>
                    </div>
                        <div className="bg-white rounded-lg p-3 border border-yellow-100">
                          <div className="text-sm font-medium text-yellow-600 mb-1">Health</div>
                    <div className="text-base font-semibold text-gray-900">
                            {formData.targetPinHealth || "0"}%
                    </div>
                  </div>
                </div>
                    </div>
                    </div>
                  </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleEditForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isDispatching ? "Đang điều phối..." : "Xác nhận điều phối"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Source Station Selection Modal */}
        {showSourceStationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chọn Trạm Nguồn</h3>
                      <p className="text-sm text-gray-600">Chọn trạm có pin slot cần thay thế</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSourceStationModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {stationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải danh sách trạm...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stations.map((station) => (
                      <div
                        key={station.id}
                        onClick={() => handleSourceStationSelect(station)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          station.status === "maintenance"
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                            : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
                        }`}
                      >
                        {/* Maintenance Overlay */}
                        {station.status === "maintenance" && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636 5.636 18.364" />
                            </svg>
                          </div>
                        )}

                        {/* Station Info */}
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            station.status === "maintenance" 
                              ? "bg-gray-200" 
                              : "bg-gradient-to-br from-blue-100 to-indigo-100"
                          }`}>
                            <svg className={`w-6 h-6 ${
                              station.status === "maintenance" ? "text-gray-400" : "text-blue-600"
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-base mb-1 ${
                              station.status === "maintenance" ? "text-gray-500" : "text-gray-900"
                            }`}>
                              {station.name}
                            </h4>
                            <p className={`text-sm mb-2 ${
                              station.status === "maintenance" ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {station.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                station.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {station.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                              </span>
                              <span className={`text-xs font-medium ${
                                station.status === "maintenance" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                ID: {station.stationId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Target Station Selection Modal */}
        {showTargetStationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-amber-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chọn Trạm Đích</h3>
                      <p className="text-sm text-gray-600">Chọn trạm có pin slot để thay thế</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTargetStationModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {stationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải danh sách trạm...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stations.map((station) => (
                      <div
                        key={station.id}
                        onClick={() => handleTargetStationSelect(station)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          station.status === "maintenance"
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                            : "bg-white border-yellow-200 hover:border-yellow-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
                        }`}
                      >
                        {/* Maintenance Overlay */}
                        {station.status === "maintenance" && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636 5.636 18.364" />
                            </svg>
                          </div>
                        )}

                        {/* Station Info */}
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            station.status === "maintenance" 
                              ? "bg-gray-200" 
                              : "bg-gradient-to-br from-yellow-100 to-amber-100"
                          }`}>
                            <svg className={`w-6 h-6 ${
                              station.status === "maintenance" ? "text-gray-400" : "text-yellow-600"
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-base mb-1 ${
                              station.status === "maintenance" ? "text-gray-500" : "text-gray-900"
                            }`}>
                              {station.name}
                            </h4>
                            <p className={`text-sm mb-2 ${
                              station.status === "maintenance" ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {station.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                station.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {station.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                              </span>
                              <span className={`text-xs font-medium ${
                                station.status === "maintenance" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                ID: {station.stationId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBatteryDispatch;
