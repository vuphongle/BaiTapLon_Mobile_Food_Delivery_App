// screens/AccountScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig"; // Import Firestore
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

const AccountScreen = () => {
  const navigation = useNavigation(); // Lấy đối tượng điều hướng
  const [userData, setUserData] = useState(null); // State để lưu trữ dữ liệu người dùng
  const [loading, setLoading] = useState(true); // State để hiển thị loading
  const [imageSource, setImageSource] = useState(null); // State để quản lý nguồn ảnh

  const [isEditing, setIsEditing] = useState(false); // State để xác định xem đang chỉnh sửa hay không
  const [editedName, setEditedName] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); // State để quản lý quá trình cập nhật

  // Map các giá trị image từ Firestore thành các ảnh cục bộ
  const localImages = {
    gojung: require('../img/img_Account/gojung.jpg'),
    // Thêm các ảnh cục bộ khác nếu cần
    // default: require('../img/img_Account/default-avatar.png'),
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            // Khởi tạo nguồn ảnh
            setImageSource(data.image ? { uri: data.image } : require('../img/img_Account/gojung.jpg'));
          } else {
            console.log("No such document!");
            Alert.alert("Lỗi", "Không tìm thấy dữ liệu người dùng.");
          }
        } else {
          console.log("No user is signed in.");
          Alert.alert("Lỗi", "Không tìm thấy người dùng đăng nhập.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    console.log("Logging out..."); // Kiểm tra xem hàm có được gọi khi nhấn nút không
    auth.signOut()
      .then(() => {
        console.log("Đăng xuất thành công!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất.");
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(userData.ten);
    setEditedPhoneNumber(userData.sodienthoai);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName("");
    setEditedPhoneNumber("");
  };

  const handleUpdate = async () => {
    // Kiểm tra dữ liệu nhập vào
    if (!editedName.trim() || !editedPhoneNumber.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsUpdating(true); // Bắt đầu quá trình cập nhật

    try {
      const user = auth.currentUser;
      if (user) {
        // Cập nhật dữ liệu trong Firestore
        await setDoc(doc(db, "users", user.uid), {
          ten: editedName,
          sodienthoai: editedPhoneNumber,
        }, { merge: true }); // Sử dụng merge để không ghi đè các trường khác

        // Cập nhật state userData để phản ánh thay đổi
        setUserData(prevData => ({
          ...prevData,
          ten: editedName,
          sodienthoai: editedPhoneNumber,
        }));

        Alert.alert("Thành công", "Cập nhật thông tin thành công.");
        setIsEditing(false); // Kết thúc chế độ chỉnh sửa
      } else {
        Alert.alert("Lỗi", "Không tìm thấy người dùng đăng nhập.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setIsUpdating(false); // Kết thúc quá trình cập nhật
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43bed8" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy dữ liệu người dùng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={imageSource}
          onError={() => {
            console.log("Failed to load remote image. Falling back to local image.");
            setImageSource(require('../img/img_Account/gojung.jpg'));
          }}
        />
        <View style={styles.userInfo}>
          {isEditing ? (
            <>
              <Text style={styles.label}>Tên:</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nhập tên của bạn"
                placeholderTextColor="#ccc"
              />
              <Text style={styles.label}>Số điện thoại:</Text>
              <TextInput
                style={styles.input}
                value={editedPhoneNumber}
                onChangeText={setEditedPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                placeholderTextColor="#ccc"
              />
            </>
          ) : (
            <>
              <Text style={styles.userName}>{userData.ten}</Text>
              <View style={styles.userRating}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{userData.danhgia}</Text>
                <Text style={styles.phoneNumber}>• {userData.sodienthoai}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Silver Badge cố định */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SILVER</Text>
      </View>

      {/* Nút Chỉnh sửa/Cập nhật thông tin */}
      <View style={styles.actionButtons}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdate}
              disabled={isUpdating} // Vô hiệu hóa khi đang cập nhật
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Lưu</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isUpdating} // Vô hiệu hóa khi đang cập nhật
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nội dung cuộn */}
      <ScrollView style={styles.scrollContainer}>
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
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: '#48bcdc',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 100,
    borderRadius: 40,
    margin: 5,
    backgroundColor: '#ccc', // Thêm nền để dễ nhận diện khi ảnh chưa tải
  },
  userInfo: {
    marginLeft: 15,
    flex: 1, // Để chiếm hết không gian còn lại
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
  scrollContainer: {
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#43bed8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  button: {
    // Các thuộc tính chung cho các nút
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingBottom: 5,
    color: '#FFFFFF',
  },
});

export default AccountScreen;
