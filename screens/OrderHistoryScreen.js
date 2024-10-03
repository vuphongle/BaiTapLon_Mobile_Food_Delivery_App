// screens/OrderHistoryScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const ordersRef = collection(db, "orders");
          const q = query(ordersRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy người dùng đăng nhập.");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderConfirmed", { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Mã đơn hàng: {item.id}</Text>
        <Text style={styles.orderDate}>
          {item.orderDate
            ? new Date(item.orderDate.seconds * 1000).toLocaleDateString()
            : "Không xác định"}
        </Text>
      </View>
      <Text style={styles.orderTotal}>Tổng tiền: {formatPrice(item.totalAmount)} VND</Text>
      <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
    </TouchableOpacity>
  );

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43bed8" />
        <Text>Đang tải lịch sử đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="archive-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderTotal: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
});
