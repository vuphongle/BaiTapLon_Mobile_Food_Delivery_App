import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyOrderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đây là màn hình My Order</Text>
    </View>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 18,
  },
});
