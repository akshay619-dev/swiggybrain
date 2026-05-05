import { MCPClient } from "./client"
import type {
  Address, DineoutRestaurant, DineoutRestaurantDetails,
  DineoutSlot, Booking, BookingStatus, TrackingInfo,
} from "./types"

export class DineoutClient {
  constructor(private client: MCPClient) {}

  async getSavedLocations(): Promise<Address[]> {
    return this.client.callTool<Address[]>("get_saved_locations")
  }

  async searchRestaurants(locationId: string, query?: string): Promise<DineoutRestaurant[]> {
    return this.client.callTool<DineoutRestaurant[]>("search_restaurants_dineout", { locationId, ...(query && { query }) })
  }

  async getRestaurantDetails(restaurantId: string): Promise<DineoutRestaurantDetails> {
    return this.client.callTool<DineoutRestaurantDetails>("get_restaurant_details", { restaurantId })
  }

  async getAvailableSlots(restaurantId: string, date?: string, guests?: number): Promise<DineoutSlot[]> {
    return this.client.callTool<DineoutSlot[]>("get_available_slots", {
      restaurantId,
      ...(date && { date }),
      ...(guests !== undefined && { guests }),
    })
  }

  async createCart(restaurantId: string, slotTime: string, guests: number): Promise<Booking> {
    return this.client.callTool<Booking>("create_cart", { restaurantId, slotTime, guests })
  }

  async bookTable(restaurantId: string, slotTime: string, guests: number): Promise<Booking> {
    return this.client.callTool<Booking>("book_table", { restaurantId, slotTime, guests })
  }

  async getBookingStatus(bookingId: string): Promise<BookingStatus> {
    return this.client.callTool<BookingStatus>("get_booking_status", { bookingId })
  }

  async reportError(description: string): Promise<void> {
    await this.client.callTool<void>("report_error", { description })
  }
}
