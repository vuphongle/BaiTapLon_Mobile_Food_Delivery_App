import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Nhập AsyncStorage

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDiPgr4s2U2qMro82HkacY62FqxMV-vWuE",
  authDomain: "fooddeliverypt-191e4.firebaseapp.com",
  projectId: "fooddeliverypt-191e4",
  storageBucket: "fooddeliverypt-191e4.appspot.com",
  messagingSenderId: "1041371125948",
  appId: "1:1041371125948:web:372118f0a9ea33569958b9"
};

// Khởi tạo ứng dụng Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Firebase Auth với AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Sử dụng AsyncStorage để lưu trữ trạng thái xác thực
});

// Khởi tạo Firestore
const db = getFirestore(app);

export { app, auth, db };
