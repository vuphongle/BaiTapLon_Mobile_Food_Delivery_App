// screens/CategoryScreen.js

import React, { useState, useEffect, useRef } from "react";
import { fetchRestaurants } from '../data/restaurants'; // Import hàm fetchRestaurants
import { fetchBanners } from '../data/banners'; // Import hàm fetchBanners
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const sortOptionColors = {
  "Giá: Thấp đến Cao": "#43bed8",
  "Giá: Cao đến Thấp": "#43bed8",
  "Đánh giá": "#43bed8",
  "Thời gian giao hàng": "#43bed8",
};

const CategoryScreen = ({ navigation, route }) => {
  const { category } = route.params; // Nhận tham số category từ navigation
  const [allRestaurants, setAllRestaurants] = useState([]); // State cho danh sách nhà hàng gốc
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // State cho danh sách nhà hàng sau khi lọc
  const [loading, setLoading] = useState(true); // State để hiển thị loading
  const [sortOption, setSortOption] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]); // State cho nhiều tùy chọn lọc
  const [isSortOptionsVisible, setSortOptionsVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3); // State để quản lý số lượng nhà hàng hiển thị

  // State và loading cho banners
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  // State cho nhà hàng được đề xuất
  const [recommendedRestaurant, setRecommendedRestaurant] = useState(null);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentBannerIndex(index);
    }
  }).current;

  // Hàm lấy dữ liệu từ Firestore khi component được mount
  useEffect(() => {
    const getData = async () => {
      try {
        // Lấy dữ liệu nhà hàng
        const restaurantData = await fetchRestaurants();
        // Lọc nhà hàng theo danh mục
        const filtered = restaurantData.filter((restaurant) =>
          restaurant.categories.includes(category)
        );
        setAllRestaurants(filtered);
        setFilteredRestaurants(filtered); // Khởi tạo filteredRestaurants với các nhà hàng thuộc danh mục

        // Lấy dữ liệu banners
        const bannerData = await fetchBanners();
        setBanners(bannerData);

        // Chọn ngẫu nhiên một nhà hàng để đề xuất
        if (filtered.length > 0) {
          const randomIndex = Math.floor(Math.random() * filtered.length);
          setRecommendedRestaurant(filtered[randomIndex]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
        setLoadingBanners(false);
      }
    };
    getData();
  }, [category]);

  // Hàm xử lý khi nhấn vào một nhà hàng
  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  // Hàm xử lý khi nhấn vào một tùy chọn sắp xếp
  const handleSortPress = (option) => {
    if (sortOption === option) {
      // Nếu tùy chọn đã được chọn, bỏ chọn nó
      setSortOption(null);
    } else {
      setSortOption(option);
    }
    setSortOptionsVisible(false);
    // Thêm logic sắp xếp và lọc danh sách nhà hàng tại đây
    applySortAndFilter(option, filterOptions);
  };

  // Hàm xử lý khi nhấn vào một tùy chọn lọc
  const handleFilterPress = (option) => {
    let updatedFilters = [...filterOptions];
    if (updatedFilters.includes(option)) {
      // Nếu tùy chọn đã được chọn, bỏ chọn nó
      updatedFilters = updatedFilters.filter((item) => item !== option);
    } else {
      // Thêm tùy chọn vào mảng lọc
      updatedFilters.push(option);
    }
    setFilterOptions(updatedFilters);
    // Thêm logic sắp xếp và lọc danh sách nhà hàng tại đây
    applySortAndFilter(sortOption, updatedFilters);
  };

  // Hàm mở/đóng dropdown sắp xếp
  const toggleSortOptions = () => {
    setSortOptionsVisible(!isSortOptionsVisible);
  };

  // Hàm áp dụng cả sắp xếp và lọc
  const applySortAndFilter = (sortOpt, filterOpts) => {
    let updatedList = [...allRestaurants];

    // Áp dụng lọc
    if (filterOpts.length > 0) {
      filterOpts.forEach((filter) => {
        if (filter === "Freeship") {
          updatedList = updatedList.filter((restaurant) => restaurant.freeship);
        } else if (filter === "Near You") {
          updatedList = updatedList.filter((restaurant) => restaurant.nearYou);
        } else if (filter === "Favorite") {
          updatedList = updatedList.filter((restaurant) => restaurant.favorite);
        } else if (filter === "Partner") {
          updatedList = updatedList.filter((restaurant) => restaurant.partner);
        }
      });
    }

    // Áp dụng sắp xếp
    if (sortOpt) {
      switch (sortOpt) {
        case "Giá: Thấp đến Cao":
          updatedList.sort(
            (a, b) => averagePrice(a.dishes) - averagePrice(b.dishes)
          );
          break;
        case "Giá: Cao đến Thấp":
          updatedList.sort(
            (a, b) => averagePrice(b.dishes) - averagePrice(a.dishes)
          );
          break;
        case "Đánh giá":
          updatedList.sort((a, b) => b.rating - a.rating);
          break;
        case "Thời gian giao hàng":
          updatedList.sort(
            (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
          );
          break;
        default:
          break;
      }
    }

    setFilteredRestaurants(updatedList);
    setVisibleCount(3); // Reset visible count khi lọc hoặc sắp xếp
  };

  // Hàm tính giá trung bình của các món ăn trong nhà hàng
  const averagePrice = (dishes) => {
    const total = dishes.reduce(
      (sum, dish) => sum + parseFloat(dish.price.replace('$', '')),
      0
    );
    return total / dishes.length;
  };

  // Hàm xử lý khi nhấn vào nút "See More" cho danh sách nhà hàng chính
  const handleSeeMorePress = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // Thêm một mục "See More" vào danh sách nếu cần
  const dataToRender = filteredRestaurants.slice(0, visibleCount);

  // Kiểm tra xem có cần hiển thị nút "See More" không
  const shouldShowSeeMore = visibleCount < filteredRestaurants.length;

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
      {loadingBanners ? (
        <ActivityIndicator size="large" color="#43bed8" />
      ) : banners.length > 0 ? (
        <>
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
        </>
      ) : (
        // Hiển thị placeholder nếu không có banners
        <View style={styles.noBannersContainer}>
          <Text style={styles.noBannersText}>Không có banner nào</Text>
        </View>
      )}
    </View>
  );

  // Hàm xử lý khi nhấn vào nút "See All" cho Recommended
  const handleSeeAllRecommendedPress = () => {
    Alert.alert("See All", "Bạn đã bấm vào nút See All");
    // Thêm logic điều hướng hoặc hiển thị danh sách toàn bộ nhà hàng được đề xuất tại đây
  };

  // Hàm render từng mục trong FlatList cho Recommended Restaurants
  const renderRecommendedItem = () => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => {
        if (recommendedRestaurant) {
          navigation.navigate('RestaurantDetail', { restaurant: recommendedRestaurant });
        }
      }}
    >
      {recommendedRestaurant ? (
        <>
          <Image source={{ uri: recommendedRestaurant.image }} style={styles.restaurantImage} />

          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{recommendedRestaurant.name}</Text>

            <View style={styles.dishesContainer}>
              {recommendedRestaurant.dishes.slice(0, 2).map((dish, index) => (
                <Text key={index} style={styles.dishText}>
                  {dish.name} - {dish.price}
                </Text>
              ))}
              {recommendedRestaurant.dishes.length > 2 && (
                <Text style={styles.moreDishesText}>
                  +{recommendedRestaurant.dishes.length - 2} thêm
                </Text>
              )}
            </View>

            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantDetailText}>
                {recommendedRestaurant.deliveryTime}
              </Text>
              <Ionicons name="star" size={16} color="#f1c40f" />
              <Text style={styles.restaurantDetailText}>{recommendedRestaurant.rating}</Text>
            </View>

            <View style={styles.chipsContainer}>
              {recommendedRestaurant.freeship && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Freeship</Text>
                </View>
              )}
              {recommendedRestaurant.nearYou && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Gần bạn</Text>
                </View>
              )}
              {recommendedRestaurant.favorite && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Yêu thích</Text>
                </View>
              )}
              {recommendedRestaurant.partner && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Đối tác</Text>
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noResultsText}>Không có nhà hàng đề xuất.</Text>
      )}
    </TouchableOpacity>
  );

  // Hiển thị loading khi dữ liệu đang được lấy
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43bed8" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút Quay Lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backButtonText}>{category}</Text>
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
              Sắp xếp
            </Text>
            <Ionicons
              name={isSortOptionsVisible ? "chevron-up" : "chevron-down"}
              size={14}
              color={sortOption ? "#fff" : "#333"}
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>

          {/* Các chip khác (Filter Options) */}
          {["Freeship", "Near You", "Favorite", "Partner"].map((option) => (
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
                {option === "Near You" ? "Gần bạn" : option === "Freeship" ? "Freeship" : option === "Favorite" ? "Yêu thích" : "Đối tác"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dropdown Sort Options */}
        {isSortOptionsVisible && (
          <View style={styles.sortOptionsContainer}>
            {[
              "Giá: Thấp đến Cao",
              "Giá: Cao đến Thấp",
              "Đánh giá",
              "Thời gian giao hàng",
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
        {filteredRestaurants.length === 0 ? (
          <Text style={styles.noResultsText}>
            Không tìm thấy nhà hàng nào phù hợp.
          </Text>
        ) : (
          dataToRender.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.restaurantCard}
                onPress={() => handleRestaurantPress(item)}
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
                        +{item.dishes.length - 2} thêm
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
                        <Text style={styles.chipText}>Gần bạn</Text>
                      </View>
                    )}
                    {item.favorite && (
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>Yêu thích</Text>
                      </View>
                    )}
                    {item.partner && (
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>Đối tác</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Nút See More */}
        {shouldShowSeeMore && filteredRestaurants.length > 0 && (
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={handleSeeMorePress}
          >
            <Text style={styles.seeMoreText}>Xem thêm</Text>
          </TouchableOpacity>
        )}

        {/* Banner quảng cáo */}
        {renderBannerAd()}

        {/* Mục Recommended for you */}
        <View style={styles.recommendedContainer}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>Đề xuất cho bạn</Text>
            <TouchableOpacity onPress={handleSeeAllRecommendedPress}>
              <Text style={styles.recommendedSeeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {recommendedRestaurant ? (
            renderRecommendedItem()
          ) : (
            <Text style={styles.noResultsText}>Không có nhà hàng đề xuất.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryScreen;

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
  seeMoreButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#cef9ff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  seeMoreText: {
    color: "#4b96a3",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
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
