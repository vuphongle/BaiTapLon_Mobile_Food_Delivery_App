// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';

const { width } = Dimensions.get('window');

// Dữ liệu cho banners, categories, collections, recommendedItems, saleItems
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
  { id: '1', name: 'Rice', icon: 'nutrition-outline' }, // nutrition-outline thay thế rice-outline
  { id: '2', name: 'Healthy', icon: 'leaf-outline' },
  { id: '3', name: 'Drink', icon: 'wine-outline' },
  { id: '4', name: 'Fastfood', icon: 'pizza-outline' },
  { id: '5', name: 'Dessert', icon: 'ice-cream-outline' },
  { id: '6', name: 'Snack', icon: 'nutrition-outline' },
];

const collections = [
  { id: '1', name: 'FREESHIP', image: 'https://via.placeholder.com/80/00FF00/FFFFFF?text=FS' },
  { id: '2', name: 'DEAL $1', image: 'https://via.placeholder.com/80/FF0000/FFFFFF?text=D1' },
  { id: '3', name: 'NEAR YOU', image: 'https://via.placeholder.com/80/0000FF/FFFFFF?text=NY' },
  { id: '4', name: 'POPULAR', image: 'https://via.placeholder.com/80/FFFF00/FFFFFF?text=PP' },
  { id: '5', name: 'NEW ARRIVAL', image: 'https://via.placeholder.com/80/FFA500/FFFFFF?text=NA' },
  { id: '6', name: 'BEST SELLER', image: 'https://via.placeholder.com/80/800080/FFFFFF?text=BS' },
];

const recommendedItems = [
  {
    id: '1',
    title: 'Restaurant 1',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.5 • 30-40 mins',
  },
  {
    id: '2',
    title: 'Restaurant 2',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.5 • 30-40 mins',
  },
  {
    id: '3',
    title: 'Restaurant 3',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.5 • 30-40 mins',
  },
  {
    id: '4',
    title: 'Restaurant 4',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.5 • 30-40 mins',
  },
  {
    id: '5',
    title: 'Restaurant 5',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.5 • 30-40 mins',
  },
];

const saleItems = [
  {
    id: '1',
    title: '50% OFF',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.0',
  },
  {
    id: '2',
    title: '50% OFF',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.0',
  },
  {
    id: '3',
    title: '50% OFF',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.0',
  },
  {
    id: '4',
    title: '50% OFF',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.0',
  },
  {
    id: '5',
    title: '50% OFF',
    image: 'https://via.placeholder.com/100',
    rating: '⭐ 4.0',
  },
];

// Helper function để chia mảng collections thành các nhóm có tối đa 2 mục
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const HomeScreen = ({ navigation }) => {
  const collectionChunks = chunkArray(collections, 2); // Mỗi nhóm có tối đa 2 mục

  // Hàm xử lý khi nhấn vào mục trong Recommended hoặc Sale
  const handleItemPress = (title) => {
    Alert.alert('Thông báo', `Bạn đã nhấn vào: ${title}`);
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
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
                onPress={() => handleItemPress('See More')}
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
        <TouchableOpacity style={styles.voucherContainer} onPress={() => handleItemPress('Voucher')}>
          <View style={styles.voucherContent}>
            <Ionicons name="ticket-outline" size={30} color="#6200ee" style={styles.voucherIcon} />
            <View>
              <Text style={styles.voucherText}>You have 5 vouchers here</Text>
              <Text style={styles.voucherSubText}>Tap to view your vouchers</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Collections */}
        <View style={styles.collectionsContainer}>
          {/* Header Collections */}
          <View style={styles.collectionsHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity onPress={() => handleItemPress('View all Collections')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          {/* Grid của Collections với ScrollView ngang */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {collectionChunks.map((chunk, index) => (
              <View key={index} style={styles.collectionChunk}>
                {chunk.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.collectionItem}
                    onPress={() => handleItemPress(`Bộ sưu tập: ${item.name}`)}
                  >
                    {/* Hình ảnh bên trái */}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.collectionImage}
                      resizeMode="cover"
                    />
                    {/* Chữ bên phải */}
                    <Text style={styles.collectionText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recommended for you */}
        <View style={styles.sectionContainer}>
          {/* Header Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <TouchableOpacity onPress={() => handleItemPress('View all Recommended')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Recommended Items ScrollView */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleItemPress(item.title)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardRating}>{item.rating}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sale up to 50% */}
        <View style={styles.sectionContainer}>
          {/* Header Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sale up to 50%</Text>
            <TouchableOpacity onPress={() => handleItemPress('View all Sales')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Sale Items ScrollView */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {saleItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.saleCard}
                onPress={() => handleItemPress(item.title)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.saleImage}
                  resizeMode="cover"
                />
                <Text style={styles.saleText}>{item.title}</Text>
                <Text style={styles.saleRating}>{item.rating}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 16,
  },
  // Banner sử dụng ScrollView ngang
  bannerList: {
    marginBottom: 20,
  },
  bannerItem: {
    width: width - 32, // Full width minus padding (16 * 2)
    marginRight: 16,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 150,
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
    width: 140,
  },
  // Nút "SEE MORE" đặt ở góc dưới bên trái của banner
  seeMoreButton: {
    position: 'absolute',
    bottom: 10, // Đặt ở phía dưới cùng
    left: 20, // Đặt ở góc trái
    backgroundColor: '#50ddfb',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  voucherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voucherIcon: {
    marginRight: 15,
  },
  voucherText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  voucherSubText: {
    fontSize: 12,
    color: '#666',
  },
  // Collections
  collectionsContainer: {
    marginBottom: 20,
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collectionChunk: {
    flexDirection: 'column',
    marginRight: 16,
  },
  collectionItem: {
    flexDirection: 'row', // Đặt hình ảnh và văn bản theo hàng ngang
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    width: 200, // Chiều rộng mỗi cột
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 10, // Tạo góc bo cho hình vuông
    marginRight: 10,
    backgroundColor: '#fff', // Màu nền cho hình ảnh, bạn có thể thay đổi
  },
  collectionText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
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
