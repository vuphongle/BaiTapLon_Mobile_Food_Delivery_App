// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import GoogleLoginScreen from "./screens/GoogleLoginScreen";
import PhoneLoginScreen from "./screens/PhoneLoginScreen";
import MyOrderScreen from "./screens/MyOrderScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import InboxScreen from "./screens/InboxScreen";
import AccountScreen from "./screens/AccountScreen";
import OrderConfirmedScreen from "./screens/OrderConfirmedScreen";
import HomeStack from "./navigation/HomeStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { OrderProvider } from "./context/OrderContext";
import DeliveryMapScreen from "./screens/DeliveryMapScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tạo một component cho Bottom Tabs
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // Tùy chỉnh biểu tượng cho từng tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "MyOrder":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Favorites":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Inbox":
              iconName = focused ? "mail" : "mail-outline";
              break;
            case "Account":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3396aa",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Ẩn header của từng tab
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen
        name="MyOrder"
        component={MyOrderScreen}
        options={{ title: "My Order" }}
      />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <OrderProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoogleLogin"
            component={GoogleLoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PhoneLogin"
            component={PhoneLoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderConfirmed"
            component={OrderConfirmedScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeliveryMap"
            component={DeliveryMapScreen}
            options={{ headerShown: false, title: "Vị trí giao hàng" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </OrderProvider>
  );
}
