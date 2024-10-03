// context/OrderContext.js
import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import { db, auth } from '../firebaseConfig'; // Import db và auth từ firebaseConfig
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [myOrder, setMyOrder] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const addDishToOrder = (newDish, restaurant) => {
    if (myOrder.length === 0 || myOrder[0].restaurantId === restaurant.id) {
      // Kiểm tra xem món đã có trong giỏ hàng chưa
      const existingDish = myOrder.find(dish => dish.id === newDish.id);
      if (existingDish) {
        // Nếu đã có, tăng số lượng
        setMyOrder(prevOrder =>
          prevOrder.map(dish =>
            dish.id === newDish.id
              ? { ...dish, quantity: dish.quantity + 1 }
              : dish
          )
        );
      } else {
        // Nếu chưa có, thêm mới với số lượng = 1
        setMyOrder(prevOrder => [
          ...prevOrder,
          { 
            ...newDish, 
            quantity: 1, 
            restaurantId: restaurant.id, 
            restaurantName: restaurant.name,
            restaurant, // Thêm đối tượng nhà hàng đầy đủ
          },
        ]);
      }
      Alert.alert('Thêm món', `Bạn đã thêm ${newDish.name} vào giỏ hàng.`);
    } else {
      // Nếu giỏ hàng khác nhà hàng, hỏi người dùng có muốn thay thế không
      Alert.alert(
        'Giỏ hàng khác nhà hàng',
        `Bạn có muốn xóa giỏ hàng tại nhà hàng "${myOrder[0].restaurantName}" và thêm món từ nhà hàng "${restaurant.name}" không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đồng ý',
            onPress: () => {
              setMyOrder([{ 
                ...newDish, 
                quantity: 1, 
                restaurantId: restaurant.id, 
                restaurantName: restaurant.name,
                restaurant, // Thêm đối tượng nhà hàng đầy đủ
              }]);
              Alert.alert('Giỏ hàng đã được cập nhật', `Giỏ hàng hiện tại là từ nhà hàng "${restaurant.name}".`);
            },
          },
        ]
      );
    }
  };

  const increaseQuantity = (dishId) => {
    setMyOrder(prevOrder =>
      prevOrder.map(dish =>
        dish.id === dishId
          ? { ...dish, quantity: dish.quantity + 1 }
          : dish
      )
    );
  };

  const decreaseQuantity = (dishId) => {
    const dish = myOrder.find(d => d.id === dishId);
    if (dish) {
      if (dish.quantity > 1) {
        setMyOrder(prevOrder =>
          prevOrder.map(d =>
            d.id === dishId
              ? { ...d, quantity: d.quantity - 1 }
              : d
          )
        );
      } else {
        // Nếu số lượng giảm về 0, yêu cầu xác nhận xóa món khỏi giỏ hàng
        Alert.alert(
          'Xóa món',
          `Bạn có muốn xóa "${dish.name}" khỏi giỏ hàng không?`,
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đồng ý', onPress: () => removeDishFromOrder(dishId) },
          ]
        );
      }
    }
  };

  const removeDishFromOrder = (dishId) => {
    setMyOrder(prevOrder => prevOrder.filter(dish => dish.id !== dishId));
  };

  const clearOrder = () => {
    setMyOrder([]);
    setDeliveryAddress(""); // Xóa địa chỉ giao hàng khi xóa đơn hàng
  };

  const placeOrder = async (paymentMethod, discount, totalAmount) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Lỗi", "Không tìm thấy người dùng đăng nhập.");
      return null;
    }

    if (myOrder.length === 0) {
      Alert.alert("Lỗi", "Giỏ hàng của bạn đang trống.");
      return null;
    }

    const orderData = {
      userId: user.uid,
      orderDate: Timestamp.now(),
      items: myOrder.map(dish => ({
        productId: dish.id,
        productName: dish.name,
        quantity: dish.quantity,
        price: dish.price,
      })),
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod,
      discount: discount ? {
        code: discount.code,
        discount: discount.discount,
      } : null,
      status: "Confirmed",
      driverInfo: null,
      restaurantInfo: {
        id: myOrder[0].restaurant.id,
        name: myOrder[0].restaurant.name,
        address: myOrder[0].restaurant.address,
      },
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      Alert.alert("Thành công", "Đơn hàng đã được đặt thành công!");
      clearOrder();
      return docRef.id;
    } catch (error) {
      console.error("Error placing order: ", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt đơn hàng.");
      return null;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      myOrder, 
      addDishToOrder, 
      removeDishFromOrder, 
      clearOrder, 
      increaseQuantity, 
      decreaseQuantity,
      deliveryAddress,
      setDeliveryAddress,
      placeOrder,
    }}>
      {children}
    </OrderContext.Provider>
  );
};
