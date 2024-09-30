import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation ,CommonActions } from '@react-navigation/native'; // Import điều hướng

const AccountScreen = () => {
  const navigation = useNavigation(); // Lấy đối tượng điều hướng

  const handleLogout = () => {
    console.log("Logging out..."); // Kiểm tra xem hàm có được gọi khi nhấn nút không
    navigation.navigate('Login'); // Thử điều hướng tới màn hình Login
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          style={styles.avatar} 
          source={require('../img/img_Account/gojung.jpg')} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Trần Trọng Tín</Text>
          <View style={styles.userRating}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.9</Text>
            <Text style={styles.phoneNumber}>• +84947672072</Text>
          </View>
        </View>
      </View>

      {/* Silver Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SILVER</Text>
      </View>

      {/* Account Options */}
      <View style={styles.optionsContainer}>
        <OptionItem title="Quản lý chi tiêu" isNew={true} />
        <OptionItem title="Ví trả sau" isNew={true} />
        <OptionItem title="Liên kết tài khoản" />
        <OptionItem title="Khuyến mại" />
        <OptionItem title="Gói tiết kiệm" />
        <OptionItem title="Giới thiệu & Nhận ưu đãi" />
        <OptionItem title="Thanh toán" />
        <OptionItem title="Mở tài khoản Doanh nghiệp" />
        <OptionItem title="Hộp thư" />
        <OptionItem title="Hỗ trợ" />
        <OptionItem title="Cài đặt" />
        <OptionItem title="Điều khoản & Chính sách" />
        {/* Nút Đăng xuất */}
        <TouchableOpacity onPress={handleLogout}>
          <OptionItem title="Đăng xuất" onPress={handleLogout} />
         
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Component OptionItem để tạo các tùy chọn trong danh sách
const OptionItem = ({ title, isNew, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <Text style={styles.optionText}>{title}</Text>
      {isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>Mới</Text></View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#48bcdc',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    top: 7,
    width: 70,
    height: 70,
    borderRadius: 50,

  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#FFD700',
  },
  phoneNumber: {
    fontSize: 16,
    marginLeft: 10,
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  newBadge: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default AccountScreen;
