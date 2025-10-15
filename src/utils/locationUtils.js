/**
 * Utility functions để xử lý vị trí và khoảng cách
 */

/**
 * Tính khoảng cách giữa 2 điểm bằng công thức Haversine
 * @param {number} lat1 - Vĩ độ điểm 1
 * @param {number} lon1 - Kinh độ điểm 1
 * @param {number} lat2 - Vĩ độ điểm 2
 * @param {number} lon2 - Kinh độ điểm 2
 * @returns {number} Khoảng cách tính bằng km
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Tìm trạm gần nhất từ danh sách trạm
 * @param {Array} stations - Mảng các trạm sạc
 * @param {number} userLat - Vĩ độ người dùng
 * @param {number} userLon - Kinh độ người dùng
 * @returns {Object|null} Trạm gần nhất với thông tin khoảng cách
 */
export const findNearestStation = (stations, userLat, userLon) => {
  if (!stations || stations.length === 0 || !userLat || !userLon) {
    return null;
  }

  let minDistance = Infinity;
  let nearestStation = null;

  stations.forEach((station) => {
    // API trả về x, y thay vì lat, lng
    const stationLat = station.x || station.lat;
    const stationLon = station.y || station.lng;

    if (stationLat && stationLon) {
      const distance = calculateDistance(
        userLat,
        userLon,
        stationLat,
        stationLon
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = {
          ...station,
          distance: distance,
          stationLat,
          stationLon,
        };
      }
    }
  });

  return nearestStation;
};

/**
 * Sắp xếp các trạm theo khoảng cách từ gần đến xa
 * @param {Array} stations - Mảng các trạm sạc
 * @param {number} userLat - Vĩ độ người dùng
 * @param {number} userLon - Kinh độ người dùng
 * @returns {Array} Mảng trạm đã sắp xếp theo khoảng cách
 */
export const sortStationsByDistance = (stations, userLat, userLon) => {
  if (!stations || stations.length === 0 || !userLat || !userLon) {
    return stations || [];
  }

  return [...stations]
    .map((station) => {
      const stationLat = station.x || station.lat;
      const stationLon = station.y || station.lng;

      if (stationLat && stationLon) {
        const distance = calculateDistance(
          userLat,
          userLon,
          stationLat,
          stationLon
        );
        return {
          ...station,
          distance: distance,
        };
      }

      return {
        ...station,
        distance: Infinity,
      };
    })
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Lấy vị trí hiện tại của người dùng
 * @returns {Promise<Object>} Promise trả về {lat, lng} hoặc null nếu lỗi
 */
export const getUserCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Lỗi không xác định khi định vị";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Vị trí hiện tại không khả dụng";
            break;
          case error.TIMEOUT:
            errorMessage = "Hết thời gian chờ định vị";
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Format khoảng cách để hiển thị
 * @param {number} distance - Khoảng cách tính bằng km
 * @returns {string} String đã format
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Kiểm tra xem có phải trạm gần nhất không
 * @param {Object} station - Trạm cần kiểm tra
 * @param {Object} nearestStation - Trạm gần nhất
 * @returns {boolean} True nếu là trạm gần nhất
 */
export const isNearestStation = (station, nearestStation) => {
  return nearestStation && station.stationID === nearestStation.stationID;
};

/**
 * Lấy màu sắc cho khoảng cách
 * @param {number} distance - Khoảng cách tính bằng km
 * @returns {string} CSS class màu
 */
export const getDistanceColor = (distance) => {
  if (distance < 1) return "text-green-500"; // < 1km: xanh lá
  if (distance < 3) return "text-yellow-500"; // 1-3km: vàng
  if (distance < 5) return "text-orange-500"; // 3-5km: cam
  return "text-red-500"; // > 5km: đỏ
};

/**
 * Tạo Google Maps URL để chỉ đường
 * @param {number} userLat - Vĩ độ người dùng
 * @param {number} userLng - Kinh độ người dùng
 * @param {string} destinationAddress - Địa chỉ đích
 * @returns {string} Google Maps URL
 */
export const createGoogleMapsUrl = (userLat, userLng, destinationAddress) => {
  const encodedAddress = destinationAddress
    .replace(/ /g, "+")
    .replace(/,/g, "%2C");

  return `https://www.google.com/maps/dir/${userLat},${userLng}/${encodedAddress}`;
};

/**
 * Tạo Google Maps URL để tìm kiếm địa chỉ
 * @param {string} address - Địa chỉ cần tìm
 * @returns {string} Google Maps URL
 */
export const createGoogleMapsSearchUrl = (address) => {
  const encodedAddress = address.replace(/ /g, "+").replace(/,/g, "%2C");

  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};
