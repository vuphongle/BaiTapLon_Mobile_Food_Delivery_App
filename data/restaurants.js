// data/restaurants.js
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebaseConfig"; // Import Firestore và Storage
import { ref, getDownloadURL } from "firebase/storage";

// URL hình ảnh dự phòng
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100";

// Hàm chuyển đổi đường dẫn hình ảnh
const resolveImageURL = async (imagePath) => {
  if (!imagePath) {
    // Nếu không có đường dẫn hình ảnh, trả về hình ảnh dự phòng
    return PLACEHOLDER_IMAGE;
  }

  if (imagePath.startsWith("gs://")) {
    try {
      // Tách đường dẫn từ gs://bucket-name/relative-path
      const pathStartIndex = imagePath.indexOf('/', 5); // Tìm vị trí '/' sau 'gs://'
      const relativePath = imagePath.substring(pathStartIndex + 1);

      // Tạo tham chiếu đến Firebase Storage với đường dẫn tương đối
      const storageRef = ref(storage, relativePath);

      // Lấy URL tải xuống
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error getting download URL for:", imagePath, error);
      // Nếu có lỗi (ví dụ: hình ảnh không tồn tại), trả về hình ảnh dự phòng
      return PLACEHOLDER_IMAGE;
    }
  } else {
    // Nếu đường dẫn đã là URL HTTP(S), trả về trực tiếp
    return imagePath;
  }
};

// Dữ liệu tĩnh dự phòng (sử dụng nếu có lỗi khi lấy dữ liệu từ Firestore)
export const staticRestaurants = [
  {
    id: "1",
    type: "restaurant",
    name: "Fried Chicken Palace",
    image: "https://via.placeholder.com/100",
    deliveryTime: "15 mins",
    rating: 4.8,
    freeship: true,
    nearYou: true,
    dishes: [
      { name: "Fried Chicken", price: "$5.99", image: "https://via.placeholder.com/100" },
      { name: "Fried Chicken & Potatoes", price: "$7.99", image: "https://via.placeholder.com/100" },
      { name: "Grilled Chicken", price: "$6.99", image: "https://via.placeholder.com/100" },
    ],
  },
  // Thêm các nhà hàng khác tại đây
];

// Hàm lấy dữ liệu nhà hàng từ Firestore và xử lý hình ảnh
export const fetchRestaurants = async () => {
  try {
    const restaurantsCollection = collection(db, "restaurants");
    const restaurantSnapshot = await getDocs(restaurantsCollection);

    const restaurantList = await Promise.all(
      restaurantSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Xử lý hình ảnh nhà hàng
        const resolvedImage = await resolveImageURL(data.image);

        // Xử lý hình ảnh cho các món ăn
        const resolvedDishes = await Promise.all(
          data.dishes.map(async (dish) => ({
            ...dish,
            image: await resolveImageURL(dish.image),
          }))
        );

        return {
          id: doc.id,
          ...data,
          image: resolvedImage,
          dishes: resolvedDishes,
        };
      })
    );

    return restaurantList;
  } catch (error) {
    console.error("Error fetching restaurants from Firestore:", error);
    // Trả về dữ liệu tĩnh nếu có lỗi
    return staticRestaurants;
  }
};
