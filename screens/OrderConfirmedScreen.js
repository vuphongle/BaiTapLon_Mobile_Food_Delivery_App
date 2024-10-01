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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OrderConfirmedScreen = () => {
  const navigation = useNavigation();

  const [currentStep, setCurrentStep] = useState(1); // Bắt đầu từ bước 1 - Xác nhận đơn hàng
  const [showCancel, setShowCancel] = useState(true); // Quản lý hiển thị nút "Hủy"
  const [orderDelivered, setOrderDelivered] = useState(false); // Quản lý trạng thái giao hàng

  useEffect(() => {
    // Bước 1 -> Bước 2 sau 5 giây
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 5000);

    // Bước 2 -> Bước 3 sau 10 giây
    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 10000);

    // Bước 3 -> Bước 4 sau 15 giây
    const timer3 = setTimeout(() => {
      setCurrentStep(4);
    }, 15000);

    // Bước 4 -> Bước 5 sau 20 giây
    const timer4 = setTimeout(() => {
      setCurrentStep(5);
      setOrderDelivered(true); // Đơn hàng đã được giao
      // Hiển thị Alert thông báo giao hàng thành công
      Alert.alert(
        "Đơn hàng đã được giao",
        "Đơn hàng của bạn đã được giao thành công.",
        [
          {
            text: "OK",
            onPress: () => {
              // Bạn có thể thực hiện hành động khác ở đây nếu cần
              // Ví dụ: Để người dùng tự chọn khi nào đánh giá, chúng ta sẽ không điều hướng tự động
            },
          },
        ]
      );
    }, 20000); // 20 giây

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Khi currentStep thay đổi từ 1 sang 2, sau 1 giây ẩn nút "Hủy"
  useEffect(() => {
    if (currentStep > 1 && showCancel) {
      const timer = setTimeout(() => {
        setShowCancel(false);
      }, 1000); // 1 giây
      return () => clearTimeout(timer);
    }
  }, [currentStep, showCancel]);

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
          onPress: () => navigation.navigate("HomeMain"),
        },
      ]
    );
  };

  const handleViewMap = () => {
    navigation.navigate("DeliveryMap"); // Sử dụng navigate thay vì replace
  };

  const handleRateOrder = () => {
    navigation.navigate("Rating"); // Điều hướng đến màn hình đánh giá
  };

  const currentIllustration = getCurrentIllustration();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
        <View style={styles.container}>
          {/* Custom Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

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
          {currentStep === 4 && (
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
          {showCancel && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                currentStep > 1 && styles.cancelButtonDisabled,
              ]}
              onPress={currentStep === 1 ? handleCancelOrder : null}
              disabled={currentStep > 1}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text
                style={[
                  styles.cancelButtonText,
                  currentStep > 1 && styles.cancelButtonTextDisabled,
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
  backButton: {
    position: "absolute",
    top: 10, // Điều chỉnh dựa trên SafeArea hoặc platform
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    textAlign: "center",
    marginTop: 10,
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
    top: 11, // Center vertically with icon
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
  cancelButtonDisabled: {
    backgroundColor: "#d32f2f",
    opacity: 0.5, // Giảm độ sáng để biểu thị nút bị vô hiệu hóa
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  cancelButtonTextDisabled: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
