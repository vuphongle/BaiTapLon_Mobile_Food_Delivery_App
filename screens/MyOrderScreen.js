// screens/MyOrderScreen.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { OrderContext } from "../context/OrderContext"; // Import OrderContext
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const MyOrderScreen = () => {
  const {
    myOrder,
    clearOrder,
    increaseQuantity,
    decreaseQuantity,
    applyDiscount, // Giả sử bạn có hàm applyDiscount trong context
  } = useContext(OrderContext);
  const navigation = useNavigation(); // Sử dụng hook để truy cập navigation

  // State cho địa chỉ giao hàng, mã giảm giá, và phương thức thanh toán
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Modal để chọn mã giảm giá
  const [isDiscountModalVisible, setDiscountModalVisible] = useState(false);

  // Modal để chọn phương thức thanh toán
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

  // Danh sách các mã giảm giá có sẵn
  const discountCodes = [
    { id: "1", code: "GIAITRI20", discount: 20 },
    { id: "2", code: "SAVE10", discount: 10 },
    { id: "3", code: "FREESHIP", discount: 0 }, // Ví dụ mã giảm giá miễn phí ship
  ];

  // Danh sách các phương thức thanh toán
  const paymentMethods = [
    { id: "1", method: "Tiền mặt" },
    { id: "2", method: "Thẻ tín dụng" },
    { id: "3", method: "Ví điện tử" },
  ];

  // Lấy thông tin nhà hàng từ đơn hàng
  const restaurant = myOrder.length > 0 ? myOrder[0].restaurant : null;

  const getSubtotal = () => {
    return myOrder.reduce(
      (total, dish) => total + dish.price * dish.quantity,
      0
    );
  };

  const calculateShippingFee = () => {
    if (restaurant.freeship) {
      return 0;
    } else if (restaurant.nearYou) {
      return 20000;
    } else {
      return 30000;
    }
  };

  const getDeliveryTime = () => {
    if (restaurant && restaurant.deliveryTime) {
      return restaurant.deliveryTime;
    }
    return "Không xác định";
  };

  const getDiscountAmount = () => {
    if (selectedDiscount) {
      if (selectedDiscount.code === "FREESHIP") {
        // Nếu mã giảm giá là FREESHIP, miễn phí ship
        return calculateShippingFee();
      }
      return (
        (getSubtotal() + calculateShippingFee()) *
        (selectedDiscount.discount / 100)
      );
    }
    return 0;
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    const shippingFee = calculateShippingFee();
    const discountAmount = getDiscountAmount();
    return subtotal + shippingFee - discountAmount;
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePlaceOrder = () => {
    if (!deliveryAddress) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán.");
      return;
    }

    Alert.alert("Đặt hàng thành công", "Đơn hàng của bạn đã được gửi đi!", [
      {
        text: "OK",
        onPress: () => {
          clearOrder();
          navigation.navigate("Home");
        },
      },
    ]);
  };

  const handleSelectDiscount = (discount) => {
    setSelectedDiscount(discount);
    setDiscountModalVisible(false);
    if (discount.code === "FREESHIP") {
      Alert.alert(
        "Thành công",
        `Áp dụng mã giảm giá "${discount.code}" thành công! Miễn phí vận chuyển.`
      );
    } else {
      Alert.alert(
        "Thành công",
        `Áp dụng mã giảm giá "${discount.code}" giảm ${discount.discount}% thành công!`
      );
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method.method);
    setPaymentModalVisible(false);
    Alert.alert(
      "Phương thức thanh toán",
      `Bạn đã chọn phương thức "${method.method}".`
    );
  };

  const handleNavigateToRestaurant = () => {
    if (myOrder.length > 0) {
      const restaurant = myOrder[0].restaurant;
      if (restaurant) {
        navigation.navigate("Home", {
          screen: "RestaurantDetail",
          params: { restaurant },
        });
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin nhà hàng.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Giỏ hàng của bạn</Text>
          {myOrder.length > 0 && (
            <TouchableOpacity
              style={styles.restaurantInfo}
              onPress={handleNavigateToRestaurant}
            >
              <Ionicons name="restaurant-outline" size={20} color="#fff" />
              <Text style={[styles.restaurantName, styles.clickableText]}>
                {myOrder[0].restaurantName}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nội dung giỏ hàng */}
        <ScrollView style={styles.content}>
          {myOrder.length > 0 ? (
            <>
              {/* Phần Giao đến */}
              <View style={styles.deliveryContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="location-outline" size={24} color="#3391a4" />
                  <Text style={styles.sectionTitle}>Giao đến</Text>
                </View>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Nhập địa chỉ giao hàng"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                />
                <Text style={styles.deliveryTime}>
                  Thời gian giao hàng: {getDeliveryTime()}
                </Text>
              </View>

              {/* Danh sách món ăn */}
              {myOrder.map((dish) => (
                <View key={dish.id} style={styles.dishContainer}>
                  {/* Hình ảnh của món ăn */}
                  <Image
                    source={{
                      uri: dish.image || "https://via.placeholder.com/80",
                    }}
                    style={styles.dishImage}
                    resizeMode="cover"
                  />
                  <View style={styles.dishDetails}>
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      <Text style={styles.dishPrice}>
                        {formatPrice(dish.price)} VND
                      </Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(dish.id)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{dish.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(dish.id)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.totalPriceContainer}>
                      <Text style={styles.totalPrice}>
                        Thành tiền: {formatPrice(dish.price * dish.quantity)}{" "}
                        VND
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>
                Giỏ hàng của bạn hiện đang trống.
              </Text>
            </View>
          )}

          {/* Phần Mã giảm giá */}
          <View style={styles.discountContainer}>
            <TouchableOpacity
              style={styles.discountButton}
              onPress={() => setDiscountModalVisible(true)}
            >
              <Ionicons name="pricetag-outline" size={24} color="#3391a4" />
              <Text style={styles.discountButtonText}>
                {selectedDiscount ? selectedDiscount.code : "Chọn mã giảm giá"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Phương thức thanh toán */}
          <View style={styles.paymentContainer}>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => setPaymentModalVisible(true)}
            >
              <Ionicons name="card-outline" size={24} color="#3391a4" />
              <Text style={styles.paymentButtonText}>
                {selectedPaymentMethod
                  ? selectedPaymentMethod
                  : "Chọn phương thức thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer - Đặt hàng */}
        {myOrder.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Tạm tính:</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(getSubtotal())} VND
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Phí vận chuyển:</Text>
              <Text style={styles.summaryValue}>
                {selectedDiscount && selectedDiscount.code === "FREESHIP"
                  ? "0 VND"
                  : formatPrice(calculateShippingFee() + " VND")} 
              </Text>
            </View>
            {selectedDiscount && selectedDiscount.code !== "FREESHIP" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Giảm giá:</Text>
                <Text style={styles.summaryValue}>
                  -{selectedDiscount.discount}% (
                  {formatPrice(getDiscountAmount())} VND)
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.total}>Tổng cộng:</Text>
              <Text style={styles.total}>
                {formatPrice(getTotalPrice())} VND
              </Text>
            </View>
            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={styles.orderButton}
            >
              <Text style={styles.buttonText}>Đặt hàng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal chọn mã giảm giá */}
        <Modal
          visible={isDiscountModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDiscountModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
              <FlatList
                data={discountCodes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectDiscount(item)}
                  >
                    <Ionicons
                      name="pricetag-outline"
                      size={20}
                      color="#3391a4"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.modalItemText}>
                      {item.code}{" "}
                      {item.discount > 0
                        ? `- ${item.discount}%`
                        : "(Miễn phí ship)"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDiscountModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal chọn phương thức thanh toán */}
        <Modal
          visible={isPaymentModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPaymentModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectPaymentMethod(item)}
                  >
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color="#3391a4"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.modalItemText}>{item.method}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: -50,
    paddingBottom: 0, // Để phần footer không bị che khuất
  },
  header: {
    marginBottom: 8,
    backgroundColor: "#5fcee1",
    paddingTop: 50,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "white",
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  restaurantName: {
    fontSize: 18,
    marginLeft: 8,
    color: "#fff",
  },
  clickableText: {
    textDecorationLine: "underline",
    color: "white",
  },
  content: {
    flex: 1,
    marginBottom: 16, // Khoảng cách giữa ScrollView và Footer
    paddingHorizontal: 16,
  },
  deliveryContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  deliveryTime: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  discountContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  discountButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5fcee1",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: "#f0f8fa",
    gap: 10,
  },
  discountButtonText: {
    fontSize: 16,
    color: "#5fcee1",
    fontWeight: "600",
    flex: 1,
  },
  paymentContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5fcee1",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: "#f0f8fa",
    gap: 10,
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#5fcee1",
    fontWeight: "600",
    flex: 1,
  },
  dishContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    alignItems: "center",
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  dishDetails: {
    flex: 1,
    marginLeft: 12,
  },
  dishInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dishName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  dishPrice: {
    fontSize: 16,
    color: "black",
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "flex-start",
  },
  quantityButton: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#3391a4",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    color: "#333",
  },
  totalPriceContainer: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  totalPrice: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
  },
  total: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  orderButton: {
    backgroundColor: "#3391a4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: "#5fcee1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
