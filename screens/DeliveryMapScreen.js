// screens/DeliveryMapScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const DeliveryMapScreen = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 10.822285, // Vĩ độ địa chỉ người nhận (ví dụ: TP.HCM)
    longitude: 106.687154, // Kinh độ địa chỉ người nhận
  });

  useEffect(() => {
    // Giả sử bạn nhận được vị trí tài xế từ backend hoặc API
    // Dưới đây là vị trí giả định
    const fetchDriverLocation = async () => {
      try {
        // Vị trí giả định
        const driverLat = 10.825931; // Vĩ độ tài xế
        const driverLng = 106.683839; // Kinh độ tài xế

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
  }, []);

  useEffect(() => {
    // Giả sử sau khi tải xong bản đồ, bạn muốn tự động quay lại sau khi giao hàng thành công
    // Ví dụ: Sau 30 giây, tự động quay lại
    const deliveryCompletionTimer = setTimeout(() => {
      Alert.alert(
        "Giao hàng thành công",
        "Đơn hàng của bạn đã được giao.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("OrderConfirmed");
            },
          },
        ]
      );
    }, 30000); // 30 giây

    return () => clearTimeout(deliveryCompletionTimer);
  }, [navigation]);

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

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
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
