// components/CustomHeader.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CustomHeader = ({
  navigation,
  showBackButton = false,
  title = "Home",
}) => {
  const [searchText, setSearchText] = React.useState("");

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      // Sử dụng navigate thay vì replace để giữ stack
      navigation.navigate("Search", { query: searchText });
      setSearchText(""); // Xóa nội dung tìm kiếm sau khi tìm kiếm
    } else {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa tìm kiếm");
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={28}
              color="#fff"
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="home-outline"
            size={24}
            color="#fff"
            style={styles.headerIcon}
          />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={() => Alert.alert("Thông báo", "Click vào menu-outline")}
        >
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm món ăn hoặc nhà hàng"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#43bed8",
    paddingTop: 40, // Khoảng cách từ trên cùng (có thể điều chỉnh theo thiết bị)
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerRightButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
