export const MOCK_ADDRESSES = [
  {
    id: "addr_1",
    label: "Home",
    address: "123, 4th Cross, Koramangala 4th Block, Bangalore 560034",
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: "addr_2",
    label: "Office",
    address: "WeWork Galaxy, Residency Road, Bangalore 560025",
    lat: 12.9716,
    lng: 77.5946,
  },
]

export const MOCK_RESTAURANTS = [
  {
    id: "rest_1",
    name: "Meghana Foods",
    rating: 4.5,
    deliveryTime: "25-30 min",
    distance: "1.8 km",
    cuisines: ["Biryani", "Andhra", "South Indian"],
    costForTwo: 500,
    availabilityStatus: "OPEN",
  },
  {
    id: "rest_2",
    name: "The Bowl Company",
    rating: 4.4,
    deliveryTime: "20-25 min",
    distance: "2.1 km",
    cuisines: ["Healthy", "Bowls", "Salads"],
    costForTwo: 400,
    availabilityStatus: "OPEN",
  },
  {
    id: "rest_3",
    name: "Empire Restaurant",
    rating: 4.2,
    deliveryTime: "30-35 min",
    distance: "3.0 km",
    cuisines: ["Biryani", "North Indian", "Chinese", "Kebabs"],
    costForTwo: 600,
    availabilityStatus: "OPEN",
  },
  {
    id: "rest_4",
    name: "Punjabi Angithi",
    rating: 4.3,
    deliveryTime: "35-40 min",
    distance: "4.2 km",
    cuisines: ["North Indian", "Mughlai", "Tandoor"],
    costForTwo: 700,
    availabilityStatus: "OPEN",
  },
  {
    id: "rest_5",
    name: "Kofuku Japanese Kitchen",
    rating: 4.6,
    deliveryTime: "40-45 min",
    distance: "5.0 km",
    cuisines: ["Japanese", "Sushi", "Asian"],
    costForTwo: 900,
    availabilityStatus: "OPEN",
  },
]

export const MOCK_MENU_ITEMS = [
  {
    id: "item_1",
    name: "Chicken Dum Biryani",
    price: 320,
    description: "Aromatic basmati rice layered with tender chicken, slow-cooked with spices",
    category: "Biryani",
    isVeg: false,
    rating: 4.6,
  },
  {
    id: "item_2",
    name: "Grilled Chicken Bowl",
    price: 310,
    description: "Grilled chicken breast with quinoa, roasted veggies, and tahini dressing",
    category: "Bowls",
    isVeg: false,
    rating: 4.5,
  },
  {
    id: "item_3",
    name: "Paneer Butter Masala",
    price: 280,
    description: "Cottage cheese cubes in rich tomato-butter gravy",
    category: "Main Course",
    isVeg: true,
    rating: 4.3,
  },
  {
    id: "item_4",
    name: "Chicken Shawarma Plate",
    price: 290,
    description: "Lebanese-style grilled chicken with garlic sauce, hummus, and pita",
    category: "Lebanese",
    isVeg: false,
    rating: 4.4,
  },
  {
    id: "item_5",
    name: "Masala Dosa",
    price: 160,
    description: "Crispy rice crepe filled with spiced potato masala, served with chutney and sambar",
    category: "South Indian",
    isVeg: true,
    rating: 4.5,
  },
  {
    id: "item_6",
    name: "Butter Chicken",
    price: 380,
    description: "Tandoori chicken in creamy tomato-butter sauce",
    category: "North Indian",
    isVeg: false,
    rating: 4.4,
  },
  {
    id: "item_7",
    name: "Chicken Katsu Curry",
    price: 450,
    description: "Japanese-style breaded chicken cutlet with curry sauce and steamed rice",
    category: "Japanese",
    isVeg: false,
    rating: 4.7,
  },
]

export const MOCK_COUPONS = [
  {
    code: "SWIGGYIT",
    description: "20% off up to ₹120 on orders above ₹200",
    discount: "20%",
    minOrderValue: 200,
    maxDiscount: 120,
  },
  {
    code: "TRYNEW",
    description: "30% off up to ₹75 on first order from a restaurant",
    discount: "30%",
    minOrderValue: 149,
    maxDiscount: 75,
  },
  {
    code: "PARTY",
    description: "20% off up to ₹150 on orders above ₹500",
    discount: "20%",
    minOrderValue: 500,
    maxDiscount: 150,
  },
  {
    code: "DEAL50",
    description: "Flat ₹50 off on orders above ₹199",
    discount: "₹50 off",
    minOrderValue: 199,
    maxDiscount: 50,
  },
]

export const MOCK_FOOD_ORDERS = [
  {
    orderId: "ORD_1001",
    restaurantName: "Meghana Foods",
    status: "delivered",
    total: 640,
    createdAt: "2026-05-02T13:30:00Z",
  },
  {
    orderId: "ORD_1002",
    restaurantName: "Meghana Foods",
    status: "delivered",
    total: 320,
    createdAt: "2026-05-01T12:45:00Z",
  },
  {
    orderId: "ORD_1003",
    restaurantName: "Empire Restaurant",
    status: "delivered",
    total: 450,
    createdAt: "2026-04-29T20:00:00Z",
  },
]

export const MOCK_CART = {
  restaurantId: "rest_2",
  restaurantName: "The Bowl Company",
  items: [
    { name: "Grilled Chicken Bowl", quantity: 1, price: 310, totalPrice: 310 },
  ],
  subtotal: 310,
  taxes: 15,
  deliveryFee: 25,
  discount: 62,
  total: 288,
  couponApplied: "SWIGGYIT",
}

export const MOCK_INSTAMART_PRODUCTS = [
  {
    id: "prod_1",
    name: "Amul Paneer",
    brand: "Amul",
    category: "Dairy",
    variants: [
      { id: "var_1", name: "200g", price: 90, mrp: 99, quantity: "200g", inStock: true },
      { id: "var_2", name: "500g", price: 195, mrp: 220, quantity: "500g", inStock: true },
    ],
  },
  {
    id: "prod_2",
    name: "Knorr Butter Chicken Gravy Mix",
    brand: "Knorr",
    category: "Ready to Cook",
    variants: [
      { id: "var_3", name: "50g", price: 65, mrp: 75, quantity: "50g", inStock: true },
    ],
  },
  {
    id: "prod_3",
    name: "Fresho Butter Naan",
    brand: "Fresho",
    category: "Bakery",
    variants: [
      { id: "var_4", name: "Pack of 4", price: 50, mrp: 60, quantity: "4 pcs", inStock: true },
    ],
  },
  {
    id: "prod_4",
    name: "Tata Sampann Penne Pasta",
    brand: "Tata Sampann",
    category: "Pasta & Noodles",
    variants: [
      { id: "var_5", name: "500g", price: 55, mrp: 65, quantity: "500g", inStock: true },
    ],
  },
  {
    id: "prod_5",
    name: "Del Monte Pasta Sauce - Red",
    brand: "Del Monte",
    category: "Sauces",
    variants: [
      { id: "var_6", name: "500g", price: 90, mrp: 110, quantity: "500g", inStock: true },
    ],
  },
  {
    id: "prod_6",
    name: "Fresho Chicken Breast",
    brand: "Fresho",
    category: "Meat",
    variants: [
      { id: "var_7", name: "500g", price: 185, mrp: 210, quantity: "500g", inStock: true },
    ],
  },
]

export const MOCK_INSTAMART_GO_TO_ITEMS = [
  {
    id: "prod_7",
    name: "Amul Taaza Toned Milk",
    brand: "Amul",
    category: "Dairy",
    variants: [
      { id: "var_8", name: "1L", price: 29, mrp: 30, quantity: "1L", inStock: true },
    ],
  },
  {
    id: "prod_8",
    name: "Maggi 2-Minute Noodles",
    brand: "Maggi",
    category: "Instant Food",
    variants: [
      { id: "var_9", name: "Pack of 4", price: 56, mrp: 60, quantity: "4 pcs", inStock: true },
    ],
  },
]

export const MOCK_DINEOUT_RESTAURANTS = [
  {
    id: "dine_1",
    name: "Farzi Cafe",
    rating: 4.4,
    cuisine: ["Modern Indian", "Bar Food"],
    address: "UB City, Vittal Mallya Road, Bangalore",
    locality: "Lavelle Road",
    costForTwo: 1600,
  },
  {
    id: "dine_2",
    name: "Olive Beach",
    rating: 4.5,
    cuisine: ["Italian", "Mediterranean", "Continental"],
    address: "16, Wood Street, Ashok Nagar, Bangalore",
    locality: "Ashok Nagar",
    costForTwo: 2000,
  },
  {
    id: "dine_3",
    name: "Social Offline",
    rating: 4.1,
    cuisine: ["Continental", "North Indian", "Italian"],
    address: "Church Street, Bangalore",
    locality: "Church Street",
    costForTwo: 1200,
  },
]

export const MOCK_DINEOUT_SLOTS = [
  { date: "2026-05-10", time: "7:00 PM", available: true },
  { date: "2026-05-10", time: "7:30 PM", available: true },
  { date: "2026-05-10", time: "8:00 PM", available: true },
  { date: "2026-05-10", time: "8:30 PM", available: true },
  { date: "2026-05-10", time: "9:00 PM", available: false },
]

export const MOCK_DINEOUT_DETAILS = {
  id: "dine_1",
  name: "Farzi Cafe",
  rating: 4.4,
  cuisine: ["Modern Indian", "Bar Food"],
  address: "UB City, Vittal Mallya Road, Bangalore",
  deals: [
    { id: "deal_1", title: "Flat 20% off total bill", description: "Valid on dine-in only" },
    { id: "deal_2", title: "Complimentary dessert for tables of 4+", description: "Chef's special dessert" },
  ],
  timings: "12:00 PM - 11:30 PM",
  features: ["Live Music", "Outdoor Seating", "Full Bar", "Valet Parking"],
}

export const MOCK_BOOKING = {
  bookingId: "BK_5001",
  status: "confirmed",
  restaurantName: "Farzi Cafe",
}

export const MOCK_BOOKING_STATUS = {
  bookingId: "BK_5001",
  restaurantName: "Farzi Cafe",
  date: "2026-05-10",
  time: "8:00 PM",
  guests: 4,
  status: "confirmed",
  dealTitle: "Flat 20% off total bill",
}
