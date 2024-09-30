// screens/MyOrderScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { OrderContext } from '../context/OrderContext'; // Import OrderContext
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MyOrderScreen = () => {
  const { 
    myOrder, 
    clearOrder, 
    increaseQuantity, 
    decreaseQuantity 
  } = useContext(OrderContext);
  const navigation = useNavigation(); // Sử dụng hook để truy cập navigation

  const getTotalPrice = () => {
    return myOrder.reduce((total, dish) => total + dish.price * dish.quantity, 0);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePlaceOrder = () => {
    Alert.alert('Đặt hàng thành công', 'Đơn hàng của bạn đã được gửi đi!', [
      {
        text: 'OK',
        onPress: () => {
          clearOrder();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const handleNavigateToRestaurant = () => {
    if (myOrder.length > 0) {
      const restaurant = myOrder[0].restaurant;
      if (restaurant) {
        navigation.navigate('Home', {
          screen: 'RestaurantDetail',
          params: { restaurant },
        });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin nhà hàng.');
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
            <TouchableOpacity style={styles.restaurantInfo} onPress={handleNavigateToRestaurant}>
              <Ionicons name="restaurant-outline" size={20} color="#555" />
              <Text style={[styles.restaurantName, styles.clickableText]}>
                {myOrder[0].restaurantName}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nội dung giỏ hàng */}
        <ScrollView style={styles.content}>
          {myOrder.length > 0 ? (
            myOrder.map((dish) => (
              <View key={dish.id} style={styles.dishContainer}>
                {/* Hình ảnh của món ăn */}
                <Image
                  source={{ uri: dish.image || 'https://via.placeholder.com/80' }}
                  style={styles.dishImage}
                  resizeMode="cover"
                />
                <View style={styles.dishDetails}>
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>{formatPrice(dish.price)} VND</Text>
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
                      Thành tiền: {formatPrice(dish.price * dish.quantity)} VND
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Giỏ hàng của bạn hiện đang trống.</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer - Đặt hàng */}
        {myOrder.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.total}>Tổng cộng: {formatPrice(getTotalPrice())} VND</Text>
            {/* Bạn có thể thêm các tính năng như chọn phương thức thanh toán, mã giảm giá tại đây */}
            <TouchableOpacity onPress={handlePlaceOrder} style={styles.orderButton}>
              <Text style={styles.buttonText}>Đặt hàng</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: -50,
    paddingBottom: 0, // Để phần footer không bị che khuất
  },
  header: {
    // Bạn có thể thêm các kiểu dáng cho header nếu cần
    marginBottom: 8,
    backgroundColor: "#5fcee1",
    paddingTop: 50,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: "white"
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 18,
    marginLeft: 8,
    color: '#555',
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: "white",
  },
  content: {
    flex: 1,
    marginBottom: 16, // Khoảng cách giữa ScrollView và Footer
  },
  dishContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    alignItems: 'center',
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  dishDetails: {
    flex: 1,
    marginLeft: 12,
  },
  dishInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  dishPrice: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  quantityButton: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#3391a4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    color: '#333',
  },
  totalPriceContainer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 14,
    color: '#666',
  },
  summaryContainer: {
    // Không còn sử dụng vì đã tách footer
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderButton: {
    backgroundColor: '#3391a4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
