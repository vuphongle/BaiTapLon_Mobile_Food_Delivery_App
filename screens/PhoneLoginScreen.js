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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PhoneLoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Phần hiển thị "Bắt đầu" ở giữa màn hình */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Bắt đầu</Text>
          </View>

          {/* Phần nhập số điện thoại */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Số Di động</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+84</Text>
              <TextInput
                style={styles.input}
                placeholder="99 123 4567"
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {/* Nút "Tiếp tục" */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Home"); // Navigate to HomeScreen
              }}
            >
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  headerText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  formContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 200,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  countryCode: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    fontSize: 18,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#43bed8",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default PhoneLoginScreen;
