// screens/DeliveryMapScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

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

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
