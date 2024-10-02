// data/banners.js

import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebaseConfig"; // Import Firestore và Storage
import { ref, getDownloadURL } from "firebase/storage";

// URL hình ảnh dự phòng
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100";

/**
 * Hàm chuyển đổi đường dẫn hình ảnh
 * @param {string} imagePath - Đường dẫn hình ảnh từ Firestore hoặc Firebase Storage
 * @returns {Promise<string>} - URL hình ảnh đã được giải quyết
 */
const resolveImageURL = async (imagePath) => {
  if (!imagePath) {
    // Nếu không có đường dẫn hình ảnh, trả về hình ảnh dự phòng
    return PLACEHOLDER_IMAGE;
  }

  if (imagePath.startsWith("gs://")) {
    try {
      // Tách đường dẫn từ gs://bucket-name/relative-path
      const pathStartIndex = imagePath.indexOf('/', 5); // Tìm vị trí '/' sau 'gs://'
      if (pathStartIndex === -1) {
        throw new Error("Invalid gs:// URL");
      }
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
export const staticBanners = [
  {
    id: "1",
    title: "Khuyến mãi đặc biệt",
    image: "https://via.placeholder.com/300x150",
  },
  {
    id: "2",
    title: "Món ăn mới",
    image: "https://via.placeholder.com/300x150",
  },
  // Thêm các banner khác tại đây
];

/**
 * Hàm lấy dữ liệu banner từ Firestore và xử lý hình ảnh
 * @returns {Promise<Array>} - Danh sách banner đã được xử lý
 */
export const fetchBanners = async () => {
  try {
    const bannersCollection = collection(db, "banners");
    const bannerSnapshot = await getDocs(bannersCollection);

    const bannerList = await Promise.all(
      bannerSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Xử lý hình ảnh banner
        const resolvedImage = await resolveImageURL(data.image);

        return {
          id: doc.id,
          title: data.title,
          image: resolvedImage,
        };
      })
    );

    return bannerList;
  } catch (error) {
    console.error("Error fetching banners from Firestore:", error);
    // Trả về dữ liệu tĩnh nếu có lỗi
    return staticBanners;
  }
};
