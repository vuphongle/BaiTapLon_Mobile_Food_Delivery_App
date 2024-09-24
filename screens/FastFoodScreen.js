// screens/FastFoodScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';

const { width } = Dimensions.get('window');

// Dữ liệu mẫu cho nhà hàng
const restaurants = [
  {
    id: '1',
    name: 'Fried Chicken Palace',
    image: 'https://via.placeholder.com/100',
    deliveryTime: '15 mins',
    rating: 4.8,
    freeship: true,
    nearYou: true,
    dishes: [
      { name: 'Fried Chicken', price: '$5.99' },
      { name: 'Fried Chicken & Potatoes', price: '$7.99' },
    ],
  },
  // Thêm các nhà hàng khác tại đây
  {
    id: '2',
    name: 'Crispy Wings',
    image: 'https://via.placeholder.com/100',
    deliveryTime: '20 mins',
    rating: 4.5,
    freeship: false,
    nearYou: true,
    dishes: [
      { name: 'Crispy Wings', price: '$6.99' },
      { name: 'Spicy Wings', price: '$7.49' },
    ],
  },
  // Bạn có thể thêm nhiều nhà hàng hơn
];

const FastFoodScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('Popular');

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    Alert.alert('Tìm kiếm', `Bạn đã tìm kiếm: ${searchText}`);
    // Bạn có thể thêm logic lọc danh sách nhà hàng tại đây
  };

  // Hàm xử lý lọc
  const handleFilter = () => {
    Alert.alert('Lọc', 'Chức năng lọc chưa được triển khai.');
    // Bạn có thể thêm logic lọc danh sách nhà hàng tại đây
  };

  // Hàm xử lý khi nhấn vào một nhà hàng
  const handleRestaurantPress = (name) => {
    Alert.alert('Thông báo', `Bạn đã chọn nhà hàng: ${name}`);
    // Bạn có thể điều hướng đến màn hình chi tiết nhà hàng tại đây
  };

  // Hàm xử lý khi nhấn vào một tùy chọn sắp xếp
  const handleSortPress = (option) => {
    setSortOption(option);
    Alert.alert('Sắp xếp', `Bạn đã chọn sắp xếp theo: ${option}`);
    // Bạn có thể thêm logic sắp xếp danh sách nhà hàng tại đây
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader navigation={navigation} />

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Tùy chọn sắp xếp và lọc */}
      <View style={styles.sortContainer}>
        {['Popular', 'Freeship', 'Favorite', 'Near you', 'Parm'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.sortChip,
              sortOption === option && styles.sortChipSelected,
            ]}
            onPress={() => handleSortPress(option)}
          >
            <Text
              style={[
                styles.sortChipText,
                sortOption === option && styles.sortChipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách nhà hàng */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => handleRestaurantPress(item.name)}
          >
            {/* Hình ảnh nhà hàng */}
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />

            {/* Thông tin nhà hàng */}
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantDetailText}>{item.deliveryTime}</Text>
                <Ionicons name="star" size={16} color="#f1c40f" />
                <Text style={styles.restaurantDetailText}>{item.rating}</Text>
              </View>

              {/* Chip Freeship và Near you */}
              <View style={styles.chipsContainer}>
                {item.freeship && (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>Freeship</Text>
                  </View>
                )}
                {item.nearYou && (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>Near you</Text>
                  </View>
                )}
              </View>

              {/* Danh sách món ăn */}
              <View style={styles.dishesContainer}>
                {item.dishes.map((dish, index) => (
                  <Text key={index} style={styles.dishText}>
                    {dish.name} - {dish.price}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.restaurantList}
      />
    </View>
  );
};

export default FastFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 15,
    margin: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  sortChipSelected: {
    backgroundColor: '#e91e63',
  },
  sortChipText: {
    color: '#333',
    fontSize: 14,
  },
  sortChipTextSelected: {
    color: '#fff',
  },
  restaurantList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantInfo: {
    flex: 1,
    padding: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantDetailText: {
    marginRight: 5,
    color: '#666',
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  chip: {
    backgroundColor: '#e91e63',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  dishesContainer: {
    marginTop: 5,
  },
  dishText: {
    fontSize: 14,
    color: '#333',
  },
});
