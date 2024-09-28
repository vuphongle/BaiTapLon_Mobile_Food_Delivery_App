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
  const navigation = useNavigation();

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Đăng nhập thành công!");
        navigation.replace("MainTabs"); // Navigate to main screen after login
      } else {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
          Alert.alert("Lỗi", "Mật khẩu và Nhập lại mật khẩu không khớp.");
          return;
        }

        // Register with Firebase
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Đăng ký thành công!");
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        navigation.replace("MainTabs"); // Navigate to main screen after successful registration
      }
    } catch (error) {
      // Show error alert if authentication fails
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust if necessary
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Top Content: Header and Form */}
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
              keyboardShouldPersistTaps="handled" // Ensures taps are handled properly
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

              {/* Confirm Password (only in Register mode) */}
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

          {/* Bottom Content: Button and Switch */}
          <View style={styles.bottomContent}>
            {/* Authentication Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleAuthentication}
            >
              <Text style={styles.buttonText}>
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </Text>
            </TouchableOpacity>

            {/* Switch between Login and Register */}
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
    justifyContent: "space-between", // Distribute space between top and bottom content
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topContent: {
    flex: 1, // Take up remaining space above bottom content
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
    // Removed fixed margins
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
    // No flex, stays at the bottom
  },
  button: {
    backgroundColor: "#43bed8",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10, // Space between button and switch
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
