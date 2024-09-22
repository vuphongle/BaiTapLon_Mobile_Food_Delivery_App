import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CustomHeader = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = () => {
    // Xử lý tìm kiếm
    alert(`Bạn đã tìm kiếm: ${searchText}`);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <Ionicons name="home-outline" size={24} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.headerRightButton} onPress={() => alert('Click vào menu-outline')}>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} onPress={() => alert('Click vào icon-search')}/>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#43bed8',
    paddingTop: 40, // Khoảng cách từ trên cùng (có thể điều chỉnh theo thiết bị)
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#333',
  },
});

export default CustomHeader;
