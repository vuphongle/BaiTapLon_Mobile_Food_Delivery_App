// screens/HomeScreen.js
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: '1',
    title: 'Join Party $1',
    image: 'https://via.placeholder.com/350x150',
  },
  {
    id: '2',
    title: 'Special Offer',
    image: 'https://via.placeholder.com/350x150/ff7f7f',
  },
  {
    id: '3',
    title: 'New Arrivals',
    image: 'https://via.placeholder.com/350x150/87cefa',
  },
];

const categories = [
  { id: '1', name: 'Rice', icon: 'rice-outline' },
  { id: '2', name: 'Healthy', icon: 'leaf-outline' },
  { id: '3', name: 'Drink', icon: 'wine-outline' },
  { id: '4', name: 'Fastfood', icon: 'pizza-outline' },
  { id: '5', name: 'Dessert', icon: 'ice-cream-outline' },
  { id: '6', name: 'Snack', icon: 'nutrition-outline' },
];

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Home',
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            // Xử lý khi nhấn vào biểu tượng tìm kiếm trong Header
            alert('Nhấn vào tìm kiếm trong Header');
          }}
        >
          <Ionicons name="search-outline" size={25} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        elevation: 2,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Thanh tìm kiếm với biểu tượng bên trái */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={() => {
            // Xử lý khi người dùng nhấn Enter trên bàn phím
            alert(`Bạn đã tìm kiếm: ${searchText}`);
          }}
        />
      </View>

      {/* Banner sử dụng ScrollView ngang */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.bannerList}
      >
        {banners.map((item) => (
          <View key={item.id} style={styles.bannerItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Container chứa văn bản trên banner */}
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerText}>{item.title}</Text>
            </View>
            {/* Nút "SEE MORE" đặt ở góc dưới bên trái */}
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => alert('See More')}
            >
              <Text style={styles.seeMoreText}>SEE MORE</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Danh mục Icon */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name={category.icon} size={30} color="#fff" />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Voucher */}
      <TouchableOpacity style={styles.voucherContainer} onPress={() => alert('Xem voucher')}>
        <Text style={styles.voucherText}>You have 5 vouchers here</Text>
      </TouchableOpacity>

      {/* Collections */}
      <View style={styles.collectionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['FREESHIP', 'DEAL $1', 'NEAR YOU', 'POPULAR'].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.collectionButton}
              onPress={() => alert(`Bộ sưu tập: ${item}`)}
            >
              <Text style={styles.collectionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recommended for you */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => alert('View all Recommended')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Thẻ nhà hàng */}
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.cardTitle}>Restaurant {index + 1}</Text>
              <Text style={styles.cardRating}>⭐ 4.5 • 30-40 mins</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Giảm Giá */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sale up to 50%</Text>
          <TouchableOpacity onPress={() => alert('View all Sales')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Mặt hàng giảm giá */}
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.saleCard}>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.saleImage}
                resizeMode="cover"
              />
              <Text style={styles.saleText}>50% OFF</Text>
              <Text style={styles.saleRating}>⭐ 4.0</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  // Thanh tìm kiếm với biểu tượng bên trái
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: '100%',
  },
  // Banner sử dụng ScrollView ngang
  bannerList: {
    marginBottom: 20,
  },
  bannerItem: {
    width: width - 32, // Full width minus padding (16 * 2)
    marginRight: 16,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  // Container chứa văn bản trên banner
  bannerTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  // Nút "SEE MORE" đặt ở góc dưới bên trái của banner
  seeMoreButton: {
    position: 'absolute',
    bottom: 10, // Đặt ở phía dưới cùng
    left: 20, // Đặt ở góc trái
    backgroundColor: '#e91e63',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Danh mục Icon
  categoryContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80, // Tăng kích thước để chứa hình tròn
  },
  // Hình tròn chứa icon hoặc hình ảnh
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Bán kính bằng nửa chiều rộng/chiều cao để tạo hình tròn
    backgroundColor: '#e91e63', // Màu nền cho hình tròn, bạn có thể thay đổi
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  // Nếu sử dụng hình ảnh thay vì icon
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Tạo hình tròn
    backgroundColor: '#e91e63', // Màu nền (nếu hình ảnh chưa tải)
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Voucher
  voucherContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  voucherText: {
    fontSize: 16,
    color: '#333',
  },
  // Collections
  collectionsContainer: {
    marginBottom: 20,
  },
  collectionButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  collectionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Các phần khác như Recommended và Sale
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardRating: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  saleCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  saleImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  saleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  saleRating: {
    fontSize: 14,
    color: '#666',
  },
});
