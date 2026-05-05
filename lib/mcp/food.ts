import { MCPClient } from "./client"
import type {
  Address, Restaurant, Menu, MenuItem, Cart, CartItem,
  Coupon, Order, OrderSummary, OrderDetails, TrackingInfo,
} from "./types"

export class FoodClient {
  constructor(private client: MCPClient) {}

  async getAddresses(): Promise<Address[]> {
    return this.client.callTool<Address[]>("get_addresses")
  }

  async searchRestaurants(addressId: string, query?: string): Promise<Restaurant[]> {
    return this.client.callTool<Restaurant[]>("search_restaurants", { addressId, ...(query && { query }) })
  }

  async getRestaurantMenu(restaurantId: string): Promise<Menu> {
    return this.client.callTool<Menu>("get_restaurant_menu", { restaurantId })
  }

  async searchMenu(query: string, addressId: string): Promise<MenuItem[]> {
    return this.client.callTool<MenuItem[]>("search_menu", { query, addressId })
  }

  async getFoodCart(): Promise<Cart> {
    return this.client.callTool<Cart>("get_food_cart")
  }

  async updateFoodCart(restaurantId: string, items: CartItem[]): Promise<Cart> {
    return this.client.callTool<Cart>("update_food_cart", { restaurantId, items })
  }

  async flushFoodCart(): Promise<void> {
    await this.client.callTool<void>("flush_food_cart")
  }

  async fetchFoodCoupons(): Promise<Coupon[]> {
    return this.client.callTool<Coupon[]>("fetch_food_coupons")
  }

  async applyFoodCoupon(couponCode: string): Promise<Cart> {
    return this.client.callTool<Cart>("apply_food_coupon", { couponCode })
  }

  async placeFoodOrder(paymentMethod: "COD" = "COD"): Promise<Order> {
    return this.client.callTool<Order>("place_food_order", { paymentMethod })
  }

  async getFoodOrders(): Promise<OrderSummary[]> {
    return this.client.callTool<OrderSummary[]>("get_food_orders")
  }

  async getFoodOrderDetails(orderId: string): Promise<OrderDetails> {
    return this.client.callTool<OrderDetails>("get_food_order_details", { orderId })
  }

  async trackFoodOrder(orderId: string): Promise<TrackingInfo> {
    return this.client.callTool<TrackingInfo>("track_food_order", { orderId })
  }

  async reportError(description: string): Promise<void> {
    await this.client.callTool<void>("report_error", { description })
  }
}
