// screens/OrderConfirmedScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig"; // Import db và auth từ firebaseConfig
import { doc, getDoc, updateDoc, onSnapshot, Timestamp } from "firebase/firestore";

const { width } = Dimensions.get("window");

const OrderConfirmedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {}; // Nhận orderId qua navigation params

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(1); // Bắt đầu từ bước 1 - Xác nhận đơn hàng
  const [showCancel, setShowCancel] = useState(true); // Quản lý hiển thị nút "Hủy"
  const [orderDelivered, setOrderDelivered] = useState(false); // Quản lý trạng thái giao hàng
  const [driverInfo, setDriverInfo] = useState(null); // Thêm state cho thông tin tài xế

  // Lấy thông tin nhà hàng từ đơn hàng
  const restaurant = order?.restaurantInfo || null;

  // Thông tin nhà hàng và giao hàng
  const restaurantName = restaurant ? restaurant.name : "Không xác định";
  const deliveryTime = order?.deliveryTime || "Không xác định";
  const deliveryAddressFinal = order?.deliveryAddress || (restaurant && restaurant.address) || "Không xác định";

  useEffect(() => {
    let unsubscribe;

    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const orderRef = doc(db, "orders", orderId);
          // Sử dụng onSnapshot để lắng nghe cập nhật thời gian thực
          unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
              const orderData = { id: docSnap.id, ...docSnap.data() };
              setOrder(orderData);
              // Cập nhật currentStep dựa trên order.status
              updateCurrentStep(orderData.status);
            } else {
              Alert.alert("Lỗi", "Không tìm thấy đơn hàng.");
              navigation.goBack();
            }
          });
        } else {
          Alert.alert("Lỗi", "Không tìm thấy đơn hàng để hiển thị.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy thông tin đơn hàng.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId]);

  // Hàm để ánh xạ trạng thái đơn hàng tới currentStep
  const updateCurrentStep = (status) => {
    switch (status) {
      case "Confirmed":
        setCurrentStep(1);
        break;
      case "DriverAssigned":
        setCurrentStep(2);
        break;
      case "Preparing":
        setCurrentStep(3);
        break;
      case "Delivering":
        setCurrentStep(4);
        break;
      case "Delivered":
        setCurrentStep(5);
        setOrderDelivered(true);
        break;
      case "Cancelled":
        setCurrentStep(0); // Không hiển thị các bước nếu đơn hàng bị hủy
        break;
      default:
        setCurrentStep(1);
    }
  };

  useEffect(() => {
    if (order) {
      // Nếu đơn hàng đang trong trạng thái giao hàng hoặc đã giao hàng, lấy thông tin tài xế
      if (order.status === "Delivering" || order.status === "Delivered") {
        fetchDriverInfo(order.driverInfo);
      }
    }
  }, [order]);

  const fetchDriverInfo = async (driverId) => {
    try {
      if (driverId) {
        const driverRef = doc(db, "drivers", driverId);
        const driverSnap = await getDoc(driverRef);
        if (driverSnap.exists()) {
          setDriverInfo(driverSnap.data());
        } else {
          console.log("Không tìm thấy thông tin tài xế!");
        }
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin tài xế:", error);
      Alert.alert("Lỗi", "Không thể lấy thông tin tài xế.");
    }
  };

  // Hàm cập nhật trạng thái đơn hàng theo timer
  const handleStatusTransition = async () => {
    try {
      if (currentStep < 5) {
        const newStatus = getStatusByStep(currentStep + 1);
        const orderRef = doc(db, "orders", order.id);
        await updateDoc(orderRef, {
          status: newStatus,
          orderDate: newStatus === "Confirmed" ? Timestamp.now() : order.orderDate,
        });
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  const getStatusByStep = (step) => {
    switch (step) {
      case 1:
        return "Confirmed";
      case 2:
        return "DriverAssigned";
      case 3:
        return "Preparing";
      case 4:
        return "Delivering";
      case 5:
        return "Delivered";
      default:
        return "Confirmed";
    }
  };

  useEffect(() => {
    if (order && currentStep > 0 && currentStep < 5) {
      // Thiết lập timer cho chuyển trạng thái
      const timer = setTimeout(() => {
        handleStatusTransition();
      }, getTimerByStep(currentStep));
      return () => clearTimeout(timer);
    }
  }, [order, currentStep]);

  const getTimerByStep = (step) => {
    switch (step) {
      case 1:
        return 5000; // 5 giây
      case 2:
        return 10000; // 10 giây
      case 3:
        return 15000; // 15 giây
      case 4:
        return 20000; // 200 giây (3 phút 20 giây)
      default:
        return 5000;
    }
  };

  const steps = [
    { title: "Xác nhận" },
    { title: "Tìm tài xế" },
    { title: "Chuẩn bị" },
    { title: "Giao hàng" },
    { title: "Đã giao" },
  ];

  const illustrations = [
    {
      step: 1,
      title: "Xác nhận đơn hàng",
      iconName: "checkmark-circle-outline",
      iconColor: "#4caf50", // Màu xanh lá cho hoàn thành
    },
    {
      step: 2,
      title: "Đang tìm tài xế",
      iconName: "car-sport-outline",
      iconColor: "#2196f3", // Màu xanh dương cho đang tiến hành
    },
    {
      step: 3,
      title: "Chuẩn bị món ăn",
      iconName: "restaurant-outline",
      iconColor: "#ff9800", // Màu cam cho đang tiến hành
    },
    {
      step: 4,
      title: "Đang giao hàng",
      iconName: "bicycle-outline",
      iconColor: "#ff5722", // Màu đỏ cam cho đang tiến hành
    },
    {
      step: 5,
      title: "Đã giao hàng",
      iconName: "home-outline",
      iconColor: "#4caf50", // Màu xanh lá cho hoàn thành
    },
  ];

  const renderStep = (step, index) => {
    let iconName = "ellipse-outline";
    let iconColor = "#bdbdbd"; // Màu mặc định cho pending
    let lineColor = "#bdbdbd";

    const isLastStep = index === steps.length - 1;
    const isCompleted =
      index < currentStep - 1 || (isLastStep && currentStep >= steps.length);
    const isInProgress = index === currentStep - 1 && currentStep < steps.length;

    if (isCompleted) {
      iconName = "checkmark";
      iconColor = "#4caf50";
      lineColor = "#4caf50";
    } else if (isInProgress) {
      iconName = "time-outline";
      iconColor = "#2196f3";
      lineColor = "#2196f3";
    }

    return (
      <View key={index} style={styles.stepContainer}>
        <View style={styles.iconAndLineContainer}>
          <View style={[styles.iconContainer, { borderColor: iconColor }]}>
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          {!isLastStep && (
            <View style={[styles.horizontalLine, { backgroundColor: lineColor }]} />
          )}
        </View>
        <Text
          style={[
            styles.stepTitle,
            isCompleted
              ? styles.completedText
              : isInProgress
              ? styles.inProgressText
              : styles.pendingText,
          ]}
        >
          {step.title}
        </Text>
      </View>
    );
  };

  const getCurrentIllustration = () => {
    // Giới hạn currentStep không vượt quá số lượng bước
    const step =
      illustrations.find((item) => item.step === currentStep) ||
      illustrations[illustrations.length - 1];
    return step;
  };

  const handleNeedHelp = () => {
    Alert.alert("Trợ giúp", "Vui lòng liên hệ với chúng tôi để được hỗ trợ.");
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng này?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            try {
              // Cập nhật trạng thái đơn hàng trong Firestore
              const orderRef = doc(db, "orders", order.id);
              await updateDoc(orderRef, {
                status: "Cancelled",
              });
              Alert.alert("Thành công", "Đơn hàng đã được hủy.");
              navigation.navigate("MyOrder");
            } catch (error) {
              console.log("Lỗi khi hủy đơn hàng:", error);
              Alert.alert("Lỗi", "Không thể hủy đơn hàng.");
            }
          },
        },
      ]
    );
  };

  const handleViewMap = () => {
    if (!driverInfo) {
      Alert.alert("Thông tin tài xế", "Chưa có thông tin tài xế để hiển thị bản đồ.");
      return;
    }
    // Khi điều hướng đến DeliveryMap, truyền các thông tin cần thiết bao gồm driverInfo
    navigation.navigate("DeliveryMap", {
      restaurantName,
      deliveryTime,
      deliveryAddress: deliveryAddressFinal,
      driverInfo, // Truyền thông tin tài xế
    });
  };

  const handleRateOrder = () => {
    navigation.navigate("Rating", { orderId: order.id }); // Điều hướng đến màn hình đánh giá với orderId
  };

  const currentIllustration = getCurrentIllustration();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#43bed8" />
          <Text>Đang tải thông tin đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Không tìm thấy đơn hàng.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
        <View style={styles.container}>
          {/* Tiêu đề */}
          <Text style={styles.title}>Đơn hàng đã được xác nhận</Text>

          {/* Trạng thái hiện tại */}
          <View style={styles.statusContainer}>
            <Ionicons name="radio-button-on" size={20} color="#2196f3" />
            <Text style={styles.currentStatus}>{currentIllustration.title}</Text>
          </View>

          {/* Biểu tượng minh họa */}
          <Ionicons
            name={currentIllustration.iconName}
            size={80}
            color={currentIllustration.iconColor}
            style={styles.icon}
          />

          {/* Thanh trạng thái đơn hàng */}
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => renderStep(step, index))}
          </View>

          {/* Nút "Cần trợ giúp?" */}
          <TouchableOpacity style={styles.helpButton} onPress={handleNeedHelp}>
            <Ionicons name="help-circle-outline" size={20} color="#00796b" />
            <Text style={styles.helpButtonText}>Cần trợ giúp?</Text>
          </TouchableOpacity>

          {/* Nút "Xem Bản Đồ" hiển thị khi đang giao hàng */}
          {(order.status === "Delivering" || order.status === "Delivered") && (
            <TouchableOpacity style={styles.viewMapButton} onPress={handleViewMap}>
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text style={styles.viewMapButtonText}>Xem Bản Đồ</Text>
            </TouchableOpacity>
          )}

          {/* Nút "Đánh Giá Món Ăn" hiển thị khi đã giao hàng */}
          {orderDelivered && (
            <TouchableOpacity style={styles.rateButton} onPress={handleRateOrder}>
              <Ionicons name="star-outline" size={20} color="#fff" />
              <Text style={styles.rateButtonText}>Đánh Giá Món Ăn</Text>
            </TouchableOpacity>
          )}

          {/* Nút "Hủy" */}
          {showCancel && order.status === "Confirmed" && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
              ]}
              onPress={handleCancelOrder}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text
                style={[
                  styles.cancelButtonText,
                ]}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmedScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  currentStatus: {
    fontSize: 14,
    color: "#2196f3",
    marginLeft: 6,
    fontWeight: "600",
  },
  icon: {
    marginVertical: 15,
  },
  stepsContainer: {
    width: width * 0.95,
    marginTop: 10,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  iconAndLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#bdbdbd",
    zIndex: 1,
  },
  horizontalLine: {
    position: "absolute",
    top: 11, // Trung tâm theo chiều dọc với icon
    left: "50%",
    right: "-50%",
    height: 2,
    zIndex: 0,
  },
  stepTitle: {
    marginTop: 8,
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
    textAlign: "center",
    width: width * 0.18, // Điều chỉnh độ rộng phù hợp với số bước
  },
  completedText: {
    color: "#4caf50",
    fontWeight: "600",
  },
  inProgressText: {
    color: "#2196f3",
    fontWeight: "600",
  },
  pendingText: {
    color: "#bdbdbd",
    fontWeight: "400",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 14,
    width: width * 0.95,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButtonText: {
    color: "#00796b",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  viewMapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: width * 0.95,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  viewMapButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  rateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff9800", // Màu cam cho nút đánh giá
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: width * 0.95,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rateButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10, // Thêm khoảng cách giữa nút "Cần trợ giúp?" và nút "Hủy"
    width: width * 0.95,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
