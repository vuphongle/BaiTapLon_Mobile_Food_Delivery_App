// screens/FastFoodScreen.js
import React, { useState, useRef } from "react";
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
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

// Dữ liệu mẫu cho nhà hàng
const restaurants = [
  {
    id: "1",
    type: "restaurant",
    name: "Fried Chicken Palace",
    image: "https://via.placeholder.com/100",
    deliveryTime: "15 mins",
    rating: 4.8,
    freeship: true,
    nearYou: true,
    dishes: [
      { name: "Fried Chicken", price: "$5.99" },
      { name: "Fried Chicken & Potatoes", price: "$7.99" },
      { name: "Grilled Chicken", price: "$6.99" },
    ],
  },
  {
    id: "2",
    type: "restaurant",
    name: "Crispy Wings",
    image: "https://via.placeholder.com/100",
    deliveryTime: "20 mins",
    rating: 4.5,
    freeship: false,
    nearYou: true,
    dishes: [
      { name: "Crispy Wings", price: "$6.99" },
      { name: "Spicy Wings", price: "$7.49" },
    ],
  },
  {
    id: "3",
    type: "restaurant",
    name: "Burger Haven",
    image: "https://via.placeholder.com/100",
    deliveryTime: "25 mins",
    rating: 4.7,
    freeship: true,
    nearYou: false,
    dishes: [
      { name: "Classic Burger", price: "$8.99" },
      { name: "Cheese Burger", price: "$9.49" },
    ],
  },
  {
    id: "4",
    type: "restaurant",
    name: "Pizza Corner",
    image: "https://via.placeholder.com/100",
    deliveryTime: "30 mins",
    rating: 4.6,
    freeship: false,
    nearYou: true,
    dishes: [
      { name: "Margherita Pizza", price: "$10.99" },
      { name: "Pepperoni Pizza", price: "$12.99" },
    ],
  },
  // Thêm các nhà hàng khác tại đây
];

// Dữ liệu mẫu cho banner quảng cáo với title
const banners = [
    {
      id: "1",
      image: "https://via.placeholder.com/350x150?text=Banner+1",
      title: "Tasty Dishes",
    },
    {
      id: "2",
      image: "https://via.placeholder.com/350x150?text=Banner+2",
      title: "Special Offers",
    },
    {
      id: "3",
      image: "https://via.placeholder.com/350x150?text=Banner+3",
      title: "New Dishes Daily",
    },
  ];
  

// Ánh xạ các tùy chọn sắp xếp với màu sắc tương ứng
const sortOptionColors = {
  "Price: Low to High": "#43bed8",
  "Price: High to Low": "#43bed8",
  Rating: "#43bed8",
  "Delivery Time": "#43bed8",
};

const FastFoodScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState(null);
  const [filterOption, setFilterOption] = useState(null);
  const [isSortOptionsVisible, setSortOptionsVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerRef = useRef(null);

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    Alert.alert("Tìm kiếm", `Bạn đã tìm kiếm: ${searchText}`);
    // Thêm logic lọc danh sách nhà hàng tại đây
  };

  // Hàm xử lý lọc (nếu cần)
  const handleFilter = () => {
    Alert.alert("Lọc", "Chức năng lọc chưa được triển khai.");
    // Thêm logic lọc danh sách nhà hàng tại đây
  };

  // Hàm xử lý khi nhấn vào một nhà hàng
  const handleRestaurantPress = (name) => {
    Alert.alert("Thông báo", `Bạn đã chọn nhà hàng: ${name}`);
    // Điều hướng đến màn hình chi tiết nhà hàng nếu cần
  };

  // Hàm xử lý khi nhấn vào một tùy chọn sắp xếp
  const handleSortPress = (option) => {
    if (sortOption === option) {
      // Nếu tùy chọn đã được chọn, bỏ chọn nó
      setSortOption(null);
    } else {
      setSortOption(option);
    }
    Alert.alert("Sắp xếp", `Bạn đã chọn sắp xếp theo: ${option}`);
    setSortOptionsVisible(false);
    setFilterOption(null); // Bỏ chọn các filter khi chọn sort
    // Thêm logic sắp xếp danh sách nhà hàng tại đây
  };

  // Hàm xử lý khi nhấn vào một tùy chọn lọc
  const handleFilterPress = (option) => {
    if (filterOption === option) {
      // Nếu tùy chọn đã được chọn, bỏ chọn nó
      setFilterOption(null);
    } else {
      setFilterOption(option);
    }
    Alert.alert("Lọc", `Bạn đã chọn lọc theo: ${option}`);
    setSortOption(null); // Bỏ chọn sort khi chọn filter
    // Thêm logic lọc danh sách nhà hàng tại đây
  };

  // Hàm mở/đóng dropdown sắp xếp
  const toggleSortOptions = () => {
    setSortOptionsVisible(!isSortOptionsVisible);
  };

  // Giới hạn số lượng nhà hàng hiển thị lên đến 3
  const displayedRestaurants = restaurants.slice(0, 3);

  // Kiểm tra xem có cần hiển thị nút "See All" không
  const shouldShowSeeAll = restaurants.length > 3;

  // Hàm xử lý khi nhấn vào nút "See All"
  const handleSeeAllPress = () => {
    Alert.alert("See All", "Bạn đã bấm vào nút See All");
    // Thêm logic điều hướng hoặc hiển thị danh sách toàn bộ nhà hàng tại đây
  };

  // Thêm một mục "See All" vào danh sách nếu cần
  const dataToRender = shouldShowSeeAll
    ? [...displayedRestaurants, { id: "seeAll", type: "seeAll" }]
    : displayedRestaurants;

  // Cấu hình viewability cho FlatList
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Hàm xử lý thay đổi các mục hiển thị
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentBannerIndex(index);
    }
  }).current;

  // Hàm xử lý cuộn banner
  const handleBannerScroll = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentBannerIndex(index);
    }
  };

  // Hàm render từng mục trong FlatList
  const renderItem = ({ item }) => {
    if (item.type === "seeAll") {
      return (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={handleSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => handleRestaurantPress(item.name)}
      >
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>

          <View style={styles.dishesContainer}>
            {item.dishes.slice(0, 2).map((dish, index) => (
              <Text key={index} style={styles.dishText}>
                {dish.name} - {dish.price}
              </Text>
            ))}
            {item.dishes.length > 2 && (
              <Text style={styles.moreDishesText}>
                +{item.dishes.length - 2} more
              </Text>
            )}
          </View>

          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantDetailText}>{item.deliveryTime}</Text>
            <Ionicons name="star" size={16} color="#f1c40f" />
            <Text style={styles.restaurantDetailText}>{item.rating}</Text>
          </View>

          <View style={styles.chipsContainer}>
            {item.freeship && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Freeship</Text>
              </View>
            )}
            {item.nearYou && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Near You</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Hàm render BannerAd
  const renderBannerAd = () => (
    <View style={styles.bannerContainer}>
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + 15} // Width của mỗi mục + marginRight
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.bannerCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  "Banner Clicked",
                  `Bạn đã bấm vào Banner ${item.id}`
                )
              }
            >
              <Image source={{ uri: item.image }} style={styles.bannerImage} />
              {/* Tiêu đề của banner */}
              <View style={styles.bannerTitleContainer}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentBannerIndex
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Tùy chọn sắp xếp và lọc */}
      <View style={styles.sortContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Sort by: Button */}
          <TouchableOpacity
            style={[
              styles.sortByButton,
              sortOption
                ? { backgroundColor: sortOptionColors[sortOption] }
                : styles.sortByButtonDefault,
            ]}
            onPress={toggleSortOptions}
          >
            <Text
              style={[
                styles.sortByText,
                sortOption ? { color: "#fff" } : styles.sortByTextDefault,
              ]}
            >
              Sort by:
            </Text>
            <Ionicons
              name={isSortOptionsVisible ? "chevron-up" : "chevron-down"}
              size={14}
              color={sortOption ? "#fff" : "#333"}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>

          {/* Các chip khác (Filter Options) */}
          {["Freeship", "Favorite", "Near You", "Parm"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortChip,
                filterOption === option && styles.sortChipSelected,
              ]}
              onPress={() => handleFilterPress(option)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  filterOption === option && styles.sortChipTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dropdown Sort Options */}
        {isSortOptionsVisible && (
          <View style={styles.sortOptionsContainer}>
            {[
              "Price: Low to High",
              "Price: High to Low",
              "Rating",
              "Delivery Time",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => handleSortPress(option)}
              >
                <Text style={styles.sortOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Danh sách nhà hàng */}
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.restaurantList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={shouldShowSeeAll ? renderBannerAd() : null} // Thêm BannerAd ở cuối danh sách nếu có "See All"
      />
    </View>
  );
};

export default FastFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 15,
    margin: 16,
    marginTop: 55,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    marginLeft: 10,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    position: "relative", // Để dropdown nằm dưới
    zIndex: 1, // Đặt zIndex cao hơn để đảm bảo dropdown nằm trên FlatList
    overflow: "visible", // Đảm bảo dropdown không bị cắt
  },
  sortByButtonDefault: {
    backgroundColor: "#e0e0e0",
  },
  sortByButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43bed8", // Màu nền thay đổi khi chọn sortOption
    paddingVertical: 6,
    paddingHorizontal: 12, // Đồng nhất với sortChip
    borderRadius: 20,
    marginRight: 10,
    height: 30, // Thêm chiều cao cố định
    justifyContent: "center", // Căn giữa nội dung
  },
  sortByText: {
    fontSize: 14,
    lineHeight: 16, // Thêm lineHeight để căn chỉnh
  },
  sortByTextDefault: {
    color: "#333",
  },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
    marginBottom: 10,
    height: 30, // Thêm chiều cao cố định
    justifyContent: "center", // Căn giữa nội dung
  },
  sortChipSelected: {
    backgroundColor: "#43bed8",
  },
  sortChipText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 16, // Thêm lineHeight để căn chỉnh
  },
  sortChipTextSelected: {
    color: "#fff",
  },
  sortOptionsContainer: {
    position: "absolute",
    top: 40, // Vị trí ngay dưới sortContainer (sortByButton height + margin)
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: width - 32, // Điều chỉnh để khớp với padding của cha
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 10,
    zIndex: 2, // Đặt zIndex cao hơn để dropdown nằm trên FlatList
  },
  sortOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333",
  },
  restaurantList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  restaurantCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  restaurantImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  restaurantInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between", // Đảm bảo các phần được phân bổ đều
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dishesContainer: {
    marginBottom: 5,
  },
  dishText: {
    fontSize: 14,
    color: "#333",
  },
  moreDishesText: {
    fontSize: 14,
    color: "#999",
  },
  restaurantDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  restaurantDetailText: {
    marginRight: 5,
    color: "#666",
  },
  chipsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  chip: {
    backgroundColor: "#43bed8",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
  },
  seeAllButton: {
    width: "100%", // Chiếm toàn bộ chiều ngang
    paddingVertical: 15,
    backgroundColor: "#cef9ff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10, // Thêm marginBottom để cách nút với các thành phần khác
  },
  seeAllText: {
    color: "#4b96a3",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Căn giữa văn bản
  },
  bannerContainer: {
    marginVertical: 16,
  },
  bannerCard: {
    width: width * 0.8,
    marginRight: 15,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  bannerTitleContainer: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  bannerTitle: {
    color: "#49bed9",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Arial",
    width: 140,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#000",
  },
  paginationDotInactive: {
    backgroundColor: "#ccc",
  },
});
