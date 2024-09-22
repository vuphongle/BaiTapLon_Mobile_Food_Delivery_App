import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InBoxScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Đây là màn hình InBoxScreen</Text>
    </View>
  );
};

export default InBoxScreen;

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
