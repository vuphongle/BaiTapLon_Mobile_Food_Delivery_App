// screens/RestaurantDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;

  return (
    <View style={styles.container}>
      {/* CustomHeader với nút quay lại */}
      <CustomHeader
        navigation={navigation}
        showBackButton={true}
        title={restaurant.name}
      />

      {/* Nội dung chi tiết nhà hàng */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.details}>
            {restaurant.deliveryTime} • ⭐ {restaurant.rating}
          </Text>
          <Text style={styles.sectionTitle}>Món ăn</Text>
          {restaurant.dishes.map((dish, index) => (
            <View key={index} style={styles.dishContainer}>
              <Image
                source={{ uri: dish.image || 'https://via.placeholder.com/100' }}
                style={styles.dishImage}
                resizeMode="cover"
              />
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishPrice}>{dish.price}</Text>
              </View>
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
  contentContainer: {
    padding: 16,
  },
  restaurantImage: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#ddd',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    color: '#333',
  },
  dishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  dishInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dishPrice: {
    fontSize: 14,
    color: '#e91e63',
    marginTop: 4,
  },
});
