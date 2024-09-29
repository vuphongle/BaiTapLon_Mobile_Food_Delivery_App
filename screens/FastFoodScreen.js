// screens/FastFoodScreen.js
import React, { useState, useRef } from "react";
import { restaurants } from '../data/restaurants';
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

// Dữ liệu mẫu cho nhà hàng được đề xuất
const recommendedRestaurants = [
  {
    id: "5",
    type: "restaurant",
    name: "Sushi World",
    image: "https://via.placeholder.com/100",
    deliveryTime: "18 mins",
    rating: 4.9,
    freeship: true,
    nearYou: true,
    dishes: [
      { name: "California Roll", price: "$8.99" },
      { name: "Spicy Tuna Roll", price: "$9.99" },
      { name: "Salmon Nigiri", price: "$7.99" },
    ],
  },
  {
    id: "6",
    type: "restaurant",
    name: "Taco Fiesta",
    image: "https://via.placeholder.com/100",
    deliveryTime: "12 mins",
    rating: 4.6,
    freeship: false,
    nearYou: true,
    dishes: [
      { name: "Beef Taco", price: "$3.99" },
      { name: "Chicken Taco", price: "$3.49" },
      { name: "Veggie Taco", price: "$3.29" },
    ],
  },
  {
    id: "7",
    type: "restaurant",
    name: "Pasta Paradise",
    image: "https://via.placeholder.com/100",
    deliveryTime: "22 mins",
    rating: 4.7,
    freeship: true,
    nearYou: false,
    dishes: [
      { name: "Spaghetti Bolognese", price: "$11.99" },
      { name: "Fettuccine Alfredo", price: "$10.99" },
      { name: "Penne Arrabiata", price: "$9.99" },
    ],
  },
  {
    id: "8",
    type: "restaurant",
    name: "Noodle House",
    image: "https://via.placeholder.com/100",
    deliveryTime: "16 mins",
    rating: 4.5,
    freeship: false,
    nearYou: true,
    dishes: [
      { name: "Beef Noodle Soup", price: "$7.99" },
      { name: "Chicken Lo Mein", price: "$8.49" },
      { name: "Vegetable Udon", price: "$6.99" },
    ],
  },
  // Thêm các nhà hàng được đề xuất khác tại đây
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
  const [sortOption, setSortOption] = useState(null);
  const [filterOption, setFilterOption] = useState(null);
  const [isSortOptionsVisible, setSortOptionsVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentBannerIndex(index);
    }
  }).current;

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

  // Hàm xử lý khi nhấn vào nút "See All" cho danh sách nhà hàng chính
  const handleSeeAllPress = () => {
    Alert.alert("See All", "Bạn đã bấm vào nút See All");
    // Thêm logic điều hướng hoặc hiển thị danh sách toàn bộ nhà hàng tại đây
  };

  // Thêm một mục "See All" vào danh sách nếu cần
  const dataToRender = shouldShowSeeAll
    ? [...displayedRestaurants, { id: "seeAll", type: "seeAll" }]
    : displayedRestaurants;

  // Giới hạn số lượng nhà hàng được đề xuất hiển thị lên đến 1
  const displayedRecommended = recommendedRestaurants.slice(0, 1);

  // Hàm render từng mục trong FlatList cho Banner
  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerCard}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert("Banner Clicked", `Bạn đã bấm vào Banner ${item.id}`)
        }
      >
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
        {/* Tiêu đề của banner */}
        <View style={styles.bannerTitleContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

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
        renderItem={renderBannerItem}
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

  // Hàm xử lý khi nhấn vào nút "See All" cho Recommended
  const handleSeeAllRecommendedPress = () => {
    Alert.alert("See All", "Bạn đã bấm vào nút See All");
    // Thêm logic điều hướng hoặc hiển thị danh sách toàn bộ nhà hàng được đề xuất tại đây
  };

  // Hàm render từng mục trong FlatList cho Recommended Restaurants
  const renderRecommendedItem = ({ item }) => (
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

  return (
    <View style={styles.container}>
      {/* Nút Quay Lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backButtonText}>Fast Food</Text>
      </TouchableOpacity>

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
              Sort by
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

      {/* Danh sách nhà hàng và Banner */}
      <ScrollView
        contentContainerStyle={styles.restaurantList}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách nhà hàng */}
        {dataToRender.map((item) => {
          if (item.type === "seeAll") {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.seeAllButton}
                onPress={handleSeeAllPress}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(item.name)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.restaurantImage}
              />

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
                  <Text style={styles.restaurantDetailText}>
                    {item.deliveryTime}
                  </Text>
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
        })}

        {/* Banner quảng cáo */}
        {renderBannerAd()}

        {/* Mục Recommended for you */}
        <View style={styles.recommendedContainer}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>Recommended for you</Text>
            <TouchableOpacity onPress={handleSeeAllRecommendedPress}>
              <Text style={styles.recommendedSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={displayedRecommended}
            keyExtractor={(item) => item.id}
            renderItem={renderRecommendedItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FastFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 55,
    gap: 20,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 22,
    color: "black",
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    position: "relative",
    zIndex: 1,
    overflow: "visible",
  },
  sortByButtonDefault: {
    backgroundColor: "#e0e0e0",
  },
  sortByButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43bed8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    height: 30,
    justifyContent: "center",
  },
  sortByText: {
    fontSize: 14,
    lineHeight: 16,
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
    height: 30,
    justifyContent: "center",
  },
  sortChipSelected: {
    backgroundColor: "#43bed8",
  },
  sortChipText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 16,
  },
  sortChipTextSelected: {
    color: "#fff",
  },
  sortOptionsContainer: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: width - 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 10,
    zIndex: 2,
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
    width: "100%",
  },
  restaurantImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  restaurantInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
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
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#cef9ff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  seeAllText: {
    color: "#4b96a3",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
  recommendedContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendedSeeAll: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b96a3",
  },
});
