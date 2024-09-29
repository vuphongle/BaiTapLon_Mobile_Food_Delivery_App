// data/restaurants.js
export const restaurants = [
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
        { name: "Fried Chicken", price: "$5.99" },
        { name: "Fried Chicken & Potatoes", price: "$7.99" },
        { name: "Grilled Chicken", price: "$6.99" },
      ],
    },
    {
      id: "2",
      type: "restaurant",
      name: "Crispy Wings",
      image: "https://via.placeholder.com/100",
      deliveryTime: "20 mins",
      rating: 4.5,
      freeship: false,
      nearYou: true,
      dishes: [
        { name: "Crispy Wings", price: "$6.99", image: "https://via.placeholder.com/100" },
        { name: "Spicy Wings", price: "$7.49", image: "https://via.placeholder.com/100" },
      ],
    },
    {
      id: "3",
      type: "restaurant",
      name: "Burger Haven",
      image: "https://via.placeholder.com/100",
      deliveryTime: "25 mins",
      rating: 4.7,
      freeship: true,
      nearYou: false,
      dishes: [
        { name: "Classic Burger", price: "$8.99", image: "https://via.placeholder.com/100" },
        { name: "Cheese Burger", price: "$9.49", image: "https://via.placeholder.com/100" },
      ],
    },
    {
      id: "4",
      type: "restaurant",
      name: "Pizza Corner",
      image: "https://via.placeholder.com/100",
      deliveryTime: "30 mins",
      rating: 4.6,
      freeship: false,
      nearYou: true,
      dishes: [
        { name: "Margherita Pizza", price: "$10.99", image: "https://via.placeholder.com/100" },
        { name: "Pepperoni Pizza", price: "$12.99", image: "https://via.placeholder.com/100" },
      ],
    },
    // Thêm các nhà hàng khác tại đây
  ];  