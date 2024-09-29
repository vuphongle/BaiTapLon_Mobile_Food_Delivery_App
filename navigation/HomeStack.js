// navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FastFoodScreen from '../screens/FastFoodScreen';
import SearchScreen from '../screens/SearchScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen'; // Import

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="FastFood" 
        component={FastFoodScreen} 
        options={{ title: 'Fast Food', headerShown: false }} 
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetailScreen} 
        options={{ title: 'Chi tiết nhà hàng', headerShown: false }} 
      />
      {/* Thêm các màn hình khác nếu cần */}
    </Stack.Navigator>
  );
};

export default HomeStack;
