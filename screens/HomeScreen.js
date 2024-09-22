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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
            // Xử lý khi nhấn vào biểu tượng tìm kiếm
            alert('Nhấn vào tìm kiếm');
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
      {/* Thanh tìm kiếm */}
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

      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: 'https://via.placeholder.com/350x150' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerText}>Join Party $1</Text>
          <TouchableOpacity style={styles.seeMoreButton} onPress={() => alert('See More')}>
            <Text style={styles.seeMoreText}>SEE MORE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh mục Icon */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Rice', 'Healthy', 'Drink', 'Fastfood', 'Dessert', 'Snack'].map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <Ionicons name="restaurant-outline" size={30} color="#e91e63" />
              <Text style={styles.categoryText}>{item}</Text>
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
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  banner: {
    marginBottom: 20,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
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
  seeMoreButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  seeMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 60,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
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
