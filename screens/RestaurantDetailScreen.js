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

  // State for Enlarged Image Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  // State for Detail Modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const openDetailModal = (dish) => {
    setSelectedDish(dish);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedDish(null);
    setDetailModalVisible(false);
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
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View>
                <TouchableOpacity style={styles.modalCloseButton} onPress={closeImageModal}>
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

      {/* Modal for Dish Details */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDetailModal}
      >
        <TouchableWithoutFeedback onPress={closeDetailModal}>
          <View style={styles.detailModalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.detailModalContainer}>
                <TouchableOpacity style={styles.detailModalCloseButton} onPress={closeDetailModal}>
                  <Ionicons name="close-circle" size={30} color="#fff" />
                </TouchableOpacity>
                {selectedDish && (
                  <>
                    <Image
                      source={{ uri: selectedDish.image }}
                      style={styles.detailDishImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.detailDishName}>{selectedDish.name}</Text>
                    <Text style={styles.detailDishPrice}>{formatPrice(selectedDish.price)}</Text>
                    <Text style={styles.detailDishDescription}>{selectedDish.detail}</Text>
                    <View style={styles.detailDishStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="heart-outline" size={20} color="#e91e63" />
                        <Text style={styles.statText}>{selectedDish.likes} Likes</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="cart-outline" size={20} color="#43bed8" />
                        <Text style={styles.statText}>{selectedDish.sales} Sold</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.addToOrderButton}
                      onPress={() => {
                        handleAddDish(selectedDish);
                        closeDetailModal();
                      }}
                    >
                      <Text style={styles.addToOrderButtonText}>Thêm vào giỏ</Text>
                    </TouchableOpacity>
                  </>
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
                    <TouchableOpacity onPress={() => openImageModal(dish.image)}>
                      <Image
                        source={{ uri: dish.image || 'https://via.placeholder.com/100' }}
                        style={styles.dishImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <View style={styles.dishInfoContainer}>
                      <TouchableOpacity onPress={() => openDetailModal(dish)}>
                        <Text
                          style={styles.dishName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {dish.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.dishPrice}>{formatPrice(dish.price)}</Text>
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
  // Modal Styles for Enlarged Image
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
  // Styles for Detail Modal
  detailModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  detailModalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  detailDishImage: {
    width: width * 0.8,
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 16,
  },
  detailDishName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  detailDishPrice: {
    fontSize: 18,
    color: '#e91e63',
    marginBottom: 8,
  },
  detailDishDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailDishStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToOrderButton: {
    backgroundColor: '#43bed8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addToOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
