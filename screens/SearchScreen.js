// screens/SearchScreen.js
import React, { useState, useEffect } from "react";
import { fetchRestaurants } from '../data/restaurants'; // Import hàm fetchRestaurants thay vì dữ liệu tĩnh
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../components/CustomHeader";

const { width } = Dimensions.get("window");

const SearchScreen = ({ route, navigation }) => {
  const { query } = route.params; // Lấy từ khóa từ navigation params
  const [matchedRestaurants, setMatchedRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]); // Thêm state để lưu toàn bộ nhà hàng
  const [loading, setLoading] = useState(true); // State để hiển thị loading

  // State variables for sorting and filtering
  const [sortOption, setSortOption] = useState(null);
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]); // Chuyển từ filterOption sang filterOptions (mảng)

  // State để quản lý số lượng nhà hàng hiển thị
  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    // Hàm lấy dữ liệu nhà hàng từ Firestore khi component được mount
    const getRestaurants = async () => {
      const data = await fetchRestaurants();
      setAllRestaurants(data);
      setLoading(false);
    };
    getRestaurants();
  }, []);

  useEffect(() => {
    if (loading) return; // Nếu đang loading, không thực hiện tìm kiếm

    // Tìm kiếm các nhà hàng có món ăn khớp với từ khóa
    let results = allRestaurants.filter((restaurant) =>
      restaurant.dishes.some((dish) =>
        dish.name.toLowerCase().includes(query.toLowerCase())
      )
    );

    // Áp dụng các bộ lọc nếu có
    if (filterOptions.length > 0) {
      filterOptions.forEach((filter) => {
        switch (filter) {
          case "Freeship":
            results = results.filter((restaurant) => restaurant.freeship);
            break;
          case "Favorite":
            results = results.filter((restaurant) => restaurant.favorite);
            break;
          case "Near You":
            results = results.filter((restaurant) => restaurant.nearYou);
            break;
          case "Parm":
            results = results.filter((restaurant) => restaurant.type === "Parm");
            break;
          default:
            break;
        }
      });
    }

    // Áp dụng sort nếu có
    if (sortOption) {
      switch (sortOption) {
        case "Price: Low to High":
          results.sort((a, b) => {
            const aPrice = a.dishes.reduce(
              (sum, dish) => sum + parseFloat(dish.price.replace("$", "")),
              0
            );
            const bPrice = b.dishes.reduce(
              (sum, dish) => sum + parseFloat(dish.price.replace("$", "")),
              0
            );
            return aPrice - bPrice;
          });
          break;
        case "Price: High to Low":
          results.sort((a, b) => {
            const aPrice = a.dishes.reduce(
              (sum, dish) => sum + parseFloat(dish.price.replace("$", "")),
              0
            );
            const bPrice = b.dishes.reduce(
              (sum, dish) => sum + parseFloat(dish.price.replace("$", "")),
              0
            );
            return bPrice - aPrice;
          });
          break;
        case "Rating":
          results.sort((a, b) => b.rating - a.rating);
          break;
        case "Delivery Time":
          results.sort((a, b) => {
            const aTime = parseInt(a.deliveryTime);
            const bTime = parseInt(b.deliveryTime);
            return aTime - bTime;
          });
          break;
        default:
          break;
      }
    }

    setMatchedRestaurants(results);
    setItemsToShow(6); // Reset số lượng hiển thị khi kết quả thay đổi
  }, [query, sortOption, filterOptions, loading, allRestaurants]);

  // Hàm để toggle sort options visibility
  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  // Hàm để xử lý khi người dùng chọn một tùy chọn sắp xếp
  const handleSortPress = (option) => {
    setSortOption(option);
    setIsSortOptionsVisible(false);
  };

  // Hàm để xử lý khi người dùng chọn một tùy chọn lọc
  const handleFilterPress = (option) => {
    setFilterOptions((prevFilters) => {
      if (prevFilters.includes(option)) {
        // Nếu đã chọn, loại bỏ khỏi mảng
        return prevFilters.filter((filter) => filter !== option);
      } else {
        // Nếu chưa chọn, thêm vào mảng
        return [...prevFilters, option];
      }
    });
  };

  // Hàm để xử lý khi người dùng nhấn "See more"
  const handleSeeMore = () => {
    setItemsToShow((prev) => prev + 6); // Tăng số lượng nhà hàng hiển thị
  };

  // Hàm render cho mỗi nhà hàng
  const renderRestaurant = ({ item }) => {
    // Lọc các món ăn phù hợp với từ khóa tìm kiếm
    const filteredDishes = item.dishes.filter((dish) =>
      dish.name.toLowerCase().includes(query.toLowerCase())
    );

    // Giới hạn số lượng món ăn hiển thị là 3
    const dishesToShow = filteredDishes.slice(0, 3);
    const remainingDishesCount = filteredDishes.length - dishesToShow.length;

    return (
      <View style={styles.restaurantContainer}>
        {/* Thông tin nhà hàng */}
        <TouchableOpacity
          style={styles.restaurantHeader}
          onPress={() => {
            // Điều hướng đến màn hình chi tiết nhà hàng nếu có
            navigation.navigate("RestaurantDetail", { restaurant: item });
          }}
        >
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/100" }}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantDetails}>
              {item.deliveryTime} • ⭐ {item.rating}
            </Text>
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
            {/* Danh sách món ăn trong nhà hàng */}
            <View style={styles.dishesContainer}>
              {dishesToShow.map((dish, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dishCard}
                  onPress={() => {
                    // Điều hướng đến màn hình chi tiết nhà hàng khi nhấn vào món ăn
                    navigation.navigate("RestaurantDetail", {
                      restaurant: item,
                    });
                  }}
                >
                  <Image
                    source={{
                      uri: dish.image || "https://via.placeholder.com/100",
                    }}
                    style={styles.dishImage}
                    resizeMode="cover"
                  />
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>{dish.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {remainingDishesCount > 0 && (
                <TouchableOpacity
                  style={styles.moreDishesContainer}
                  onPress={() => {
                    // Bạn có thể điều hướng đến danh sách món ăn đầy đủ hoặc mở rộng danh sách
                    navigation.navigate("RestaurantDetail", { restaurant: item });
                  }}
                >
                  <Text style={styles.moreDishesText}>
                    Và {remainingDishesCount} món khác
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Hàm render cho ListFooterComponent
  const renderFooter = () => {
    if (itemsToShow >= matchedRestaurants.length) return null; // Không hiển thị nút nếu đã hiển thị hết

    return (
      <TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
        <Text style={styles.seeMoreText}>See more</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    // Hiển thị loading indicator khi dữ liệu đang được lấy
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43bed8" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CustomHeader với nút quay lại và giữ lại thanh tìm kiếm */}
      <CustomHeader
        navigation={navigation}
        showBackButton={true}
        title="Kết quả tìm kiếm"
      />

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
                filterOptions.includes(option) && styles.sortChipSelected,
              ]}
              onPress={() => handleFilterPress(option)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  filterOptions.includes(option) && styles.sortChipTextSelected,
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

      {/* Hiển thị số lượng kết quả tìm kiếm */}
      {matchedRestaurants.length > 0 && (
        <Text style={styles.resultsCount}>
          {matchedRestaurants.length} result
          {matchedRestaurants.length !== 1 ? "s" : ""} for "{query}"
        </Text>
      )}

      {/* Nội dung tìm kiếm */}
      {matchedRestaurants.length > 0 ? (
        <FlatList
          data={matchedRestaurants.slice(0, itemsToShow)} // Hiển thị phần dữ liệu theo số lượng
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.listContainer}
          // Đảm bảo không hiển thị scroll bar
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter} // Thêm ListFooterComponent
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.noResultsText}>
            Không tìm thấy nhà hàng nào có món ăn "{query}"
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

// Định nghĩa màu sắc cho các tùy chọn sort nếu cần
const sortOptionColors = {
  "Price: Low to High": "#ff9800",
  "Price: High to Low": "#f44336",
  "Rating": "#4caf50",
  "Delivery Time": "#2196f3",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    position: "relative",
    zIndex: 1,
    overflow: "visible",
    marginTop: 20,
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
  resultsCount: {
    fontSize: 16,
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  restaurantContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  restaurantInfo: {
    marginLeft: 16,
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restaurantDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  dishesContainer: {
    marginTop: 16,
  },
  dishCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 8,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  dishInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dishPrice: {
    fontSize: 14,
    color: "#e91e63",
    marginTop: 4,
  },
  moreDishesContainer: {
    paddingVertical: 8,
  },
  moreDishesText: {
    fontSize: 14,
    color: "#43bed8",
    fontWeight: "bold",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  seeMoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#43bed8",
    borderRadius: 8,
    marginTop: 10,
  },
  seeMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});