// screens/RatingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const RatingScreen = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(0); // Đánh giá từ 1 đến 5
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao để đánh giá.");
      return;
    }
    // Xử lý đánh giá, ví dụ gửi về backend
    Alert.alert("Cảm ơn bạn!", "Cảm ơn bạn đã đánh giá món ăn.");
    // Điều hướng trở lại màn hình chính hoặc màn hình khác
    navigation.navigate("MainTabs");
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={40}
            color="#FFD700"
            style={{ marginHorizontal: 5 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Đánh Giá Đơn Hàng</Text>

      {/* Các ngôi sao đánh giá */}
      <View style={styles.starsContainer}>{renderStars()}</View>

      {/* Trường nhập nhận xét */}
      <TextInput
        style={styles.input}
        placeholder="Viết nhận xét của bạn..."
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      {/* Nút Gửi Đánh Giá */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Gửi Đánh Giá</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginVertical: 20,
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
