// screens/GoogleLoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  ActivityIndicator, // Thêm ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const GoogleLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const navigation = useNavigation();

  const handleAuthentication = async () => {
    // Kiểm tra email và mật khẩu trước khi bắt đầu
    if (!email || !password || (!isLogin && !confirmPassword)) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsLoading(true); // Bắt đầu tải

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Đăng nhập thành công!");
        // Reset ngăn xếp điều hướng và thiết lập MainTabs làm màn hình duy nhất
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu trùng nhau
        if (password !== confirmPassword) {
          Alert.alert("Lỗi", "Mật khẩu và Nhập lại mật khẩu không khớp.");
          setIsLoading(false); // Kết thúc tải khi có lỗi
          return;
        }

        // Đăng ký với Firebase
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Đăng ký thành công!");
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        // Reset ngăn xếp điều hướng và thiết lập MainTabs làm màn hình duy nhất
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      }
    } catch (error) {
      // Hiển thị thông báo lỗi nếu xác thực thất bại
      Alert.alert("Lỗi", error.message);
      setIsLoading(false); // Kết thúc tải khi có lỗi
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Điều chỉnh nếu cần
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Nội dung phía trên: Header và Form */}
          <View style={styles.topContent}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </Text>
            </View>

            {/* Form */}
            <ScrollView
              contentContainerStyle={styles.formContainer}
              keyboardShouldPersistTaps="handled" // Đảm bảo xử lý các lần chạm đúng cách
            >
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />

              {/* Xác nhận mật khẩu (chỉ trong chế độ đăng ký) */}
              {!isLogin && (
                <>
                  <Text style={styles.label}>Nhập lại mật khẩu</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </>
              )}
            </ScrollView>
          </View>

          {/* Nội dung phía dưới: Nút và Chuyển đổi */}
          <View style={styles.bottomContent}>
            {/* Nút xác thực */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={isLoading} // Vô hiệu hóa khi đang tải
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Đăng nhập" : "Đăng ký"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Chuyển đổi giữa Đăng nhập và Đăng ký */}
            <View style={styles.switchContainer}>
              <Text>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchText}>
                  {isLogin ? " Đăng ký" : " Đăng nhập"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "space-between", // Phân phối không gian giữa nội dung trên và dưới
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topContent: {
    flex: 1, // Chiếm không gian còn lại phía trên nội dung dưới
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 55,
  },
  headerText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  formContainer: {
    // Đã loại bỏ margin cố định
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    paddingBottom: 5,
  },
  bottomContent: {
    // Không có flex, nằm ở dưới cùng
  },
  button: {
    backgroundColor: "#43bed8",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10, // Khoảng cách giữa nút và chuyển đổi
  },
  buttonDisabled: {
    backgroundColor: "#a0cde4", // Màu khác khi nút bị vô hiệu hóa
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginBottom: 15,
  },
  switchText: {
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default GoogleLoginScreen;
