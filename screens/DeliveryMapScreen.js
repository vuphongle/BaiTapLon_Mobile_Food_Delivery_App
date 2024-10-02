// screens/DeliveryMapScreen.js

import React, { useEffect, useState } from "react";
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  Text, 
  Image, 
  ScrollView,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const DeliveryMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Lấy các tham số được truyền từ OrderConfirmedScreen.js
  const { 
    restaurantName, 
    deliveryTime, 
    deliveryAddress, 
    driverInfo 
  } = route.params || {};

  const [region, setRegion] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 10.822285, // Vĩ độ địa chỉ người nhận (ví dụ: TP.HCM)
    longitude: 106.687154, // Kinh độ địa chỉ người nhận
  });

  const driver = driverInfo || {
    id: "driver123",
    image: "https://via.placeholder.com/100", // URL ảnh tài xế
    name: "Nguyễn Văn A",
    licensePlate: "29A-12345",
    phoneNumber: "0987654321",
    location: {
      latitude: 10.825931, // Vĩ độ tài xế
      longitude: 106.683839, // Kinh độ tài xế
    },
  };

  useEffect(() => {
    // Giả sử bạn nhận được vị trí tài xế từ backend hoặc API
    // Dưới đây là vị trí giả định
    const fetchDriverLocation = () => {
      try {
        const driverLat = driver.location.latitude;
        const driverLng = driver.location.longitude;

        setDriverLocation({
          latitude: driverLat,
          longitude: driverLng,
        });

        setRegion({
          latitude: (driverLat + userLocation.latitude) / 2,
          longitude: (driverLng + userLocation.longitude) / 2,
          latitudeDelta: Math.abs(driverLat - userLocation.latitude) * 2 || 0.05,
          longitudeDelta: Math.abs(driverLng - userLocation.longitude) * 2 || 0.05,
        });
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy vị trí tài xế.");
      }
    };

    fetchDriverLocation();
  }, [driver, userLocation]);

  const handleCallPress = () => {
    const phoneNumber = `tel:${driver.phoneNumber}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Lỗi", "Không thể mở ứng dụng gọi điện.");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => Alert.alert("Lỗi", "Đã xảy ra lỗi khi gọi điện."));
  };

  const handleChatPress = () => {
    navigation.navigate('MainTabs', {
      screen: 'Inbox',
      params: { 
        driverId: driver.id, 
        driverName: driver.name, 
        driverImage: driver.image 
      },
    });
  };

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút Quay Lại Tùy Chỉnh */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Bản đồ */}
      <MapView style={styles.map} region={region}>
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Tài xế đang ở đây"
            description="Vị trí hiện tại của tài xế"
            pinColor="#2196f3"
          />
        )}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Địa chỉ của bạn"
            description="Nơi giao hàng"
            pinColor="#4caf50"
          />
        )}
      </MapView>

      {/* Thông tin bổ sung bên dưới bản đồ */}
      <ScrollView contentContainerStyle={styles.infoContainer}>
        {/* Thông tin nhà hàng */}
        {restaurantName && (
          <View style={[styles.infoSection, {alignItems: 'center'}]}>
            <Text style={[styles.infoText, {fontSize: 20, fontWeight: 'bold'}]}>{restaurantName}</Text>
          </View>
        )}

        {/* Thời gian giao hàng */}
        {deliveryTime && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#2196f3" style={[styles.infoIcon, {marginTop: 0}]} />
              <View>
                <Text style={styles.infoTitle}>Thời gian giao hàng:</Text>
                <Text style={styles.infoText}>{deliveryTime}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Địa chỉ giao hàng */}
        {deliveryAddress && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#2196f3" style={[styles.infoIcon, {marginTop: 0}]} />
              <View>
                <Text style={styles.infoTitle}>Địa chỉ giao hàng:</Text>
                <Text style={styles.infoText}>{deliveryAddress}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Thông tin tài xế */}
        {driver && (
          <View style={styles.driverSection}>
            <View style={styles.separator} />

            <View style={styles.driverInfo}>
              <Image 
                source={{ uri: driver.image }} 
                style={styles.driverImage} 
              />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverDetailText}>Biển số xe: {driver.licensePlate}</Text>
                <Text style={styles.driverDetailText}>Số điện thoại: {driver.phoneNumber}</Text>
              </View>
              {/* Thêm các icon gọi điện và chat ở bên phải */}
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
                  <Ionicons name="call" size={24} color="#2196f3" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleChatPress}>
                  <Ionicons name="chatbubbles" size={24} color="#2196f3" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DeliveryMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50, // Điều chỉnh dựa trên SafeArea hoặc platform
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  map: {
    width: width,
    height: height * 0.6, // Chiếm khoảng 60% chiều cao màn hình
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: width,
    maxHeight: height * 0.4, // Chiếm tối đa 40% chiều cao màn hình
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#555555",
  },
  driverSection: {
    marginTop: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#cccccc",
    marginVertical: 10,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  driverDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  driverDetailText: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 2,
  },
  iconContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 16,
  },
});
