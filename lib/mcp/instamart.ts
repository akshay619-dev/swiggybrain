import { MCPClient } from "./client"
import type {
  Address, Product, InstamartCart, InstamartCartItem,
  InstamartOrder, InstamartOrderDetails, TrackingInfo,
} from "./types"

export class InstamartClient {
  constructor(private client: MCPClient) {}

  async getAddresses(): Promise<Address[]> {
    return this.client.callTool<Address[]>("get_addresses")
  }

  async createAddress(address: string, lat: number, lng: number): Promise<Address> {
    return this.client.callTool<Address>("create_address", { address, lat, lng })
  }

  async deleteAddress(addressId: string): Promise<void> {
    await this.client.callTool<void>("delete_address", { addressId })
  }

  async searchProducts(query: string, addressId: string): Promise<Product[]> {
    return this.client.callTool<Product[]>("search_products", { query, addressId })
  }

  async getGoToItems(addressId: string): Promise<Product[]> {
    return this.client.callTool<Product[]>("your_go_to_items", { addressId })
  }

  async getCart(): Promise<InstamartCart> {
    return this.client.callTool<InstamartCart>("get_cart")
  }

  async updateCart(items: InstamartCartItem[]): Promise<InstamartCart> {
    return this.client.callTool<InstamartCart>("update_cart", { items })
  }

  async clearCart(): Promise<void> {
    await this.client.callTool<void>("clear_cart")
  }

  async checkout(): Promise<InstamartOrder> {
    return this.client.callTool<InstamartOrder>("checkout")
  }

  async getOrders(): Promise<InstamartOrder[]> {
    return this.client.callTool<InstamartOrder[]>("get_orders")
  }

  async getOrderDetails(orderId: string): Promise<InstamartOrderDetails> {
    return this.client.callTool<InstamartOrderDetails>("get_order_details", { orderId })
  }

  async trackOrder(orderId: string): Promise<TrackingInfo> {
    return this.client.callTool<TrackingInfo>("track_order", { orderId })
  }

  async reportError(description: string): Promise<void> {
    await this.client.callTool<void>("report_error", { description })
  }
}
