// screens/RestaurantDetailScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
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
                    <Image
                      source={{ uri: dish.image || 'https://via.placeholder.com/100' }}
                      style={styles.dishImage}
                      resizeMode="cover"
                    />
                    <View style={styles.dishInfoContainer}>
                      <View style={styles.dishInfo}>
                        <Text style={styles.dishName}>{dish.name}</Text>
                        <Text style={styles.dishPrice}>{dish.price} VND</Text>
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
  },
  dishPrice: {
    fontSize: 14,
    color: 'black',
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
});
