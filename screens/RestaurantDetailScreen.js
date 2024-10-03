// screens/RestaurantDetailScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OrderContext } from '../context/OrderContext'; // Import OrderContext

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const { myOrder, addDishToOrder } = useContext(OrderContext); // Sử dụng Context

  // Get unique categories
  const categories = [...new Set(restaurant.dishes.map(dish => dish.category))];

  const handleAddDish = (dish) => {
    addDishToOrder(dish, restaurant);
  };

  // State for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  // Hàm để định dạng giá tiền
  const formatPrice = (price) => {
    const number = parseInt(price.replace(/[^0-9]/g, ''), 10);
    return number.toLocaleString('en-US') + ' VND';
  };

  return (
    <View style={styles.container}>
      {/* Fixed Image at the Top */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.details}>
              {restaurant.deliveryTime} • ⭐ {restaurant.rating}
            </Text>
            <Text style={styles.address}>{restaurant.address}</Text>
          </View>
        </View>
      </View>

      {/* Modal for Enlarged Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                  <Ionicons name="close-circle" size={30} color="#fff" />
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.enlargedImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Scrollable Content Below the Image */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sectionContainer}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {restaurant.dishes
                .filter(dish => dish.category === category)
                .map((dish, idx) => (
                  <View key={idx} style={styles.dishContainer}>
                    <TouchableOpacity onPress={() => openModal(dish.image)}>
                      <Image
                        source={{ uri: dish.image || 'https://via.placeholder.com/100' }}
                        style={styles.dishImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <View style={styles.dishInfoContainer}>
                      <View style={styles.dishInfo}>
                        <Text
                          style={styles.dishName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {dish.name}
                        </Text>
                        <Text style={styles.dishPrice}>{formatPrice(dish.price)}</Text>
                      </View>
                      <View style={styles.dishStats}>
                        <Ionicons name="heart-outline" size={16} color="#e91e63" />
                        <Text style={styles.statText}>{dish.likes}</Text>
                        <Ionicons name="cart-outline" size={16} color="#43bed8" style={{ marginLeft: 10 }} />
                        <Text style={styles.statText}>{dish.sales}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleAddDish(dish)} style={styles.addButton}>
                      <Ionicons name="add-circle-outline" size={28} color="#43bed8" />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: width,
    height: 250,
    backgroundColor: '#ddd',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  infoContainer: {
    paddingBottom: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  details: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 4,
  },
  address: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionContainer: {
    paddingTop: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  dishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  dishInfoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  dishInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
    width: width - 160, // Adjust width to prevent overflow
  },
  dishPrice: {
    fontSize: 14,
    color: '#e91e63',
    marginTop: 4,
  },
  dishStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addButton: {
    padding: 4,
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
