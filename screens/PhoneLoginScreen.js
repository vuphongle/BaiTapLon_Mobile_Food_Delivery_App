import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PhoneLoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình đăng nhập bằng số điện thoại</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default PhoneLoginScreen;
