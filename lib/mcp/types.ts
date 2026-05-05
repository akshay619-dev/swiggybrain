// Shared
export interface Address {
  id: string
  label?: string
  address: string
  lat?: number
  lng?: number
}

// Food types
export interface Restaurant {
  id: string
  name: string
  rating?: number
  deliveryTime?: string
  distance?: string
  cuisines?: string[]
  costForTwo?: number
  availabilityStatus?: string
  imageUrl?: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  description?: string
  category?: string
  isVeg?: boolean
  rating?: number
  imageUrl?: string
  variants?: MenuItemVariant[]
  addons?: MenuItemAddon[]
}

export interface MenuItemVariant {
  id: string
  name: string
  price: number
}

export interface MenuItemAddon {
  id: string
  name: string
  price: number
}

export interface MenuCategory {
  name: string
  items: MenuItem[]
}

export interface Menu {
  restaurantId: string
  categories: MenuCategory[]
}

export interface CartItem {
  itemId: string
  quantity: number
  variantId?: string
  addonIds?: string[]
}

export interface CartItemDetail {
  name: string
  quantity: number
  price: number
  totalPrice: number
}

export interface Cart {
  restaurantId?: string
  restaurantName?: string
  items: CartItemDetail[]
  subtotal: number
  taxes?: number
  deliveryFee?: number
  discount?: number
  total: number
  couponApplied?: string
}

export interface Coupon {
  code: string
  description: string
  discount?: string
  minOrderValue?: number
  maxDiscount?: number
  requiresOnlinePayment?: boolean
}

export interface Order {
  orderId: string
  status: string
  total: number
}

export interface OrderSummary {
  orderId: string
  restaurantName: string
  status: string
  total: number
  createdAt?: string
}

export interface OrderDetails {
  orderId: string
  restaurantName: string
  items: CartItemDetail[]
  status: string
  total: number
  deliveryAddress?: string
  createdAt?: string
}

export interface TrackingInfo {
  orderId: string
  status: string
  eta?: string
  deliveryPartner?: string
  currentLocation?: string
}

// Instamart types
export interface Product {
  id: string
  name: string
  brand?: string
  category?: string
  imageUrl?: string
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  mrp?: number
  quantity?: string
  inStock?: boolean
}

export interface InstamartCartItem {
  productId: string
  variantId: string
  quantity: number
}

export interface InstamartCart {
  items: Array<{
    name: string
    quantity: number
    price: number
    totalPrice: number
  }>
  subtotal: number
  taxes?: number
  deliveryFee?: number
  discount?: number
  total: number
}

export interface InstamartOrder {
  orderId: string
  status: string
  total: number
}

export interface InstamartOrderDetails {
  orderId: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  status: string
  total: number
  deliveryAddress?: string
  createdAt?: string
}

// Dineout types
export interface DineoutRestaurant {
  id: string
  name: string
  rating?: number
  cuisine?: string[]
  address?: string
  locality?: string
  costForTwo?: number
  imageUrl?: string
  timings?: string
}

export interface DineoutRestaurantDetails {
  id: string
  name: string
  rating?: number
  cuisine?: string[]
  address?: string
  deals?: DineoutDeal[]
  timings?: string
  features?: string[]
}

export interface DineoutDeal {
  id: string
  title: string
  description?: string
}

export interface DineoutSlot {
  date: string
  time: string
  available: boolean
}

export interface Booking {
  bookingId: string
  status: string
  restaurantName?: string
}

export interface BookingStatus {
  bookingId: string
  restaurantName: string
  date: string
  time: string
  guests: number
  status: string
  dealTitle?: string
}
