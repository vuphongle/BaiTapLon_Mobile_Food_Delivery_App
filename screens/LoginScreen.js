import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import điều hướng

const LoginScreen = () => {
  const navigation = useNavigation(); // Sử dụng hook điều hướng

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Grab</Text>
        <Text style={styles.subtitle}>Siêu ứng dụng đáp ứng mọi nhu cầu hàng ngày</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="facebook" size={24} color="blue" style={styles.icon} />
          <Text style={styles.buttonText}>Tiếp tục với Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="google" size={24} color="red" style={styles.icon} />
          <Text style={styles.buttonText}>Tiếp tục với Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="apple" size={24} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Tiếp tục với Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>hoặc</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PhoneLogin')}  // Điều hướng tới màn hình PhoneLogin
        >
          <FontAwesome name="phone" size={24} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Tiếp tục với số điện thoại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00b140',
    justifyContent: 'space-between',
  },
  topContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60,
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    marginBottom: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    position: 'absolute',
    left: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    height: 1,
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 10,
  },
  orText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
