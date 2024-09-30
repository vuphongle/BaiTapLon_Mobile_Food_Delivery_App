// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../components/CustomHeader";
import { fetchRestaurants } from "../data/restaurants"; // Import hàm fetchRestaurants thay vì dữ liệu tĩnh

const { width } = Dimensions.get("window");

// Dữ liệu cho banners, categories, collections, recommendedItems, saleItems
const banners = [
  {
    id: "1",
    title: "Join Party $1",
    image: "https://via.placeholder.com/350x150",
  },
  {
    id: "2",
    title: "Special Offer",
    image: "https://via.placeholder.com/350x150/ff7f7f",
  },
  {
    id: "3",
    title: "New Arrivals",
    image: "https://via.placeholder.com/350x150/87cefa",
  },
];

const categories = [
  { id: "1", name: "Thức ăn nhanh", icon: "fast-food-outline" },
  { id: "2", name: "Đồ ăn nhẹ", icon: "nutrition-outline" },
  { id: "3", name: "Đồ uống", icon: "wine-outline" },
  { id: "4", name: "Cơm", icon: "restaurant-outline" },
  { id: "5", name: "Lành mạnh", icon: "leaf-outline" },
  { id: "6", name: "Tráng miệng", icon: "ice-cream-outline" },
];

// Mục bộ sưu tập ban đầu
const initialCollections = [
  {
    id: "1",
    name: "FREESHIP",
  },
  {
    id: "2",
    name: "DEAL $1",
  },
  {
    id: "3",
    name: "NEAR YOU",
  },
  {
    id: "4",
    name: "POPULAR",
  },
  {
    id: "5",
    name: "NEW ARRIVAL",
  },
  {
    id: "6",
    name: "BEST SELLER",
  },
];

const recommendedItems = [
  {
    id: "1",
    title: "Nhà hàng 1",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.5 • 30-40 phút",
  },
  {
    id: "2",
    title: "Nhà hàng 2",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.5 • 30-40 phút",
  },
  {
    id: "3",
    title: "Nhà hàng 3",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.5 • 30-40 phút",
  },
  {
    id: "4",
    title: "Nhà hàng 4",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.5 • 30-40 phút",
  },
  {
    id: "5",
    title: "Nhà hàng 5",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.5 • 30-40 phút",
  },
];

const saleItems = [
  {
    id: "1",
    title: "Giảm 50%",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.0",
  },
  {
    id: "2",
    title: "Giảm 50%",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.0",
  },
  {
    id: "3",
    title: "Giảm 50%",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.0",
  },
  {
    id: "4",
    title: "Giảm 50%",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.0",
  },
  {
    id: "5",
    title: "Giảm 50%",
    image: "https://via.placeholder.com/100",
    rating: "⭐ 4.0",
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
  const [collectionsData, setCollectionsData] = useState(initialCollections); // Dữ liệu bộ sưu tập động
  const [allRestaurants, setAllRestaurants] = useState([]); // Lưu trữ toàn bộ nhà hàng
  const [loadingRestaurants, setLoadingRestaurants] = useState(true); // State để hiển thị loading khi tải nhà hàng

  useEffect(() => {
    // Hàm lấy dữ liệu nhà hàng khi component được mount
    const getRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        setAllRestaurants(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà hàng:", error);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    getRestaurants();
  }, []);

  useEffect(() => {
    if (loadingRestaurants) return;

    // Định nghĩa bản đồ thuộc tính cho các bộ sưu tập
    const collectionAttributeMap = {
      FREESHIP: "freeship",
      "NEAR YOU": "nearYou",
      DEAL: "deal", // Giả sử 'deal' là thuộc tính cho "DEAL $1"
      POPULAR: "popular",
      "NEW ARRIVAL": "newArrival",
      "BEST SELLER": "bestSeller",
    };

    // Tạo bản sao của bộ sưu tập để chỉnh sửa
    const updatedCollections = initialCollections.map((collection) => {
      let attribute = null;
      // Xác định thuộc tính tương ứng với tên bộ sưu tập
      if (collection.name.startsWith("DEAL")) {
        attribute = "deal"; // Ví dụ: "DEAL $1" => "deal"
      } else {
        attribute = collectionAttributeMap[collection.name];
      }

      let selectedRestaurant = null;
      let image = "https://via.placeholder.com/100"; // Mặc định

      if (attribute && allRestaurants.length > 0) {
        // Lọc các nhà hàng có thuộc tính tương ứng
        const matchedRestaurants = allRestaurants.filter(
          (restaurant) => restaurant[attribute] === true
        );

        if (matchedRestaurants.length > 0) {
          // Chọn ngẫu nhiên một nhà hàng từ danh sách phù hợp
          const randomIndex = Math.floor(Math.random() * matchedRestaurants.length);
          selectedRestaurant = matchedRestaurants[randomIndex];
          image = selectedRestaurant.image || "https://via.placeholder.com/100";
        }
      }

      return {
        ...collection,
        image,
        restaurant: selectedRestaurant,
      };
    });

    setCollectionsData(updatedCollections);
  }, [loadingRestaurants, allRestaurants]);

  // Helper function để xử lý khi nhấn vào mục bộ sưu tập
  const handleCollectionPress = (collection) => {
    if (collection.restaurant) {
      navigation.navigate("RestaurantDetail", { restaurant: collection.restaurant });
    } else {
      Alert.alert("Thông báo", "Không có nhà hàng phù hợp cho mục này.");
    }
  };

  // Hàm xử lý khi nhấn vào mục trong Categories, Recommended hoặc Sale
  const handleItemPress = (title) => {
    const categoryNames = [
      "Thức ăn nhanh",
      "Đồ ăn nhẹ",
      "Đồ uống",
      "Cơm",
      "Lành mạnh",
      "Tráng miệng",
    ];
    if (categoryNames.includes(title)) {
      navigation.navigate("Category", { category: title });
    } else {
      Alert.alert("Thông báo", `Bạn đã nhấn vào: ${title}`);
    }
  };

  // Chia collectionsData thành các cặp để hiển thị 2 hàng
  const collectionPairs = chunkArray(collectionsData, 2);

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
              {/* Nút "XEM THÊM" đặt ở góc dưới bên trái */}
              <TouchableOpacity
                style={styles.seeMoreButton}
                onPress={() => handleItemPress("XEM THÊM")}
              >
                <Text style={styles.seeMoreText}>XEM THÊM</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Danh mục Icon */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleItemPress(category.name)}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={category.icon} size={30} color="#fff" />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Voucher */}
        <TouchableOpacity
          style={styles.voucherContainer}
          onPress={() => handleItemPress("Voucher")}
        >
          <View style={styles.voucherContent}>
            <Ionicons
              name="ticket-outline"
              size={30}
              color="#6200ee"
              style={styles.voucherIcon}
            />
            <View>
              <Text style={styles.voucherText}>Bạn có 5 voucher</Text>
              <Text style={styles.voucherSubText}>
                Nhấn để xem voucher của bạn
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Bộ sưu tập */}
        <View style={styles.collectionsContainer}>
          {/* Header Collections */}
          <View style={styles.collectionsHeader}>
            <Text style={styles.sectionTitle}>Bộ sưu tập</Text>
            <TouchableOpacity onPress={() => handleItemPress("View all Collections")}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal ScrollView với hai hàng */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.collectionsScrollContainer}>
              {collectionPairs.map((pair, index) => (
                <View key={index} style={styles.collectionColumn}>
                  {pair.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.collectionItem}
                      onPress={() => handleCollectionPress(item)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.collectionImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.collectionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recommended for you */}
        <View style={styles.sectionContainer}>
          {/* Header Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đề xuất cho bạn</Text>
            <TouchableOpacity onPress={() => handleItemPress("View all Recommended")}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
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
            <Text style={styles.sectionTitle}>Giảm giá lên đến 50%</Text>
            <TouchableOpacity onPress={() => handleItemPress("View all Sales")}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
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
    backgroundColor: "#f8f8f8",
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
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
  },
  // Container chứa văn bản trên banner
  bannerTextContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    width: 200,
  },
  // Nút "XEM THÊM" đặt ở góc dưới bên trái của banner
  seeMoreButton: {
    position: "absolute",
    bottom: 10, // Đặt ở phía dưới cùng
    left: 20, // Đặt ở góc trái
    backgroundColor: "#50ddfb",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  seeMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  // Danh mục Icon
  categoryContainer: {
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
    width: 80, // Tăng kích thước để chứa hình tròn
  },
  // Hình tròn chứa icon hoặc hình ảnh
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Bán kính bằng nửa chiều rộng/chiều cao để tạo hình tròn
    backgroundColor: "#43bed8", // Màu nền cho hình tròn, bạn có thể thay đổi
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  // Nếu sử dụng hình ảnh thay vì icon
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Tạo hình tròn
    backgroundColor: "#e91e63", // Màu nền (nếu hình ảnh chưa tải)
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
  },
  // Voucher
  voucherContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  voucherContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherIcon: {
    marginRight: 15,
  },
  voucherText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  voucherSubText: {
    fontSize: 12,
    color: "#666",
  },
  // Bộ sưu tập
  collectionsContainer: {
    marginBottom: 20,
  },
  collectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#a4a8b1",
    fontWeight: "bold",
  },
  // Container cho ScrollView của Bộ sưu tập
  collectionsScrollContainer: {
    flexDirection: "row",
  },
  collectionColumn: {
    flexDirection: "column",
    marginRight: 16,
  },
  collectionItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: width / 2.7,
  },
  collectionImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  collectionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardRating: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  saleCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  saleImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  saleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  saleRating: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
