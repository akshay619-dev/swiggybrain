import {
  MOCK_ADDRESSES, MOCK_RESTAURANTS, MOCK_MENU_ITEMS, MOCK_COUPONS,
  MOCK_FOOD_ORDERS, MOCK_CART, MOCK_INSTAMART_PRODUCTS,
  MOCK_INSTAMART_GO_TO_ITEMS, MOCK_DINEOUT_RESTAURANTS,
  MOCK_DINEOUT_SLOTS, MOCK_DINEOUT_DETAILS, MOCK_BOOKING,
  MOCK_BOOKING_STATUS,
} from "./mock-data"

export async function executeMockToolCall(
  toolName: string,
  argsJson: string,
): Promise<string> {
  const args = JSON.parse(argsJson)

  // Add a small delay to simulate network latency (200-500ms)
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))

  switch (toolName) {
    // Food tools
    case "get_addresses":
    case "get_addresses_instamart":
      return JSON.stringify(MOCK_ADDRESSES)

    case "search_restaurants": {
      // Filter by query if provided
      if (args.query) {
        const q = args.query.toLowerCase()
        const filtered = MOCK_RESTAURANTS.filter(
          (r) => r.name.toLowerCase().includes(q) ||
            r.cuisines?.some((c: string) => c.toLowerCase().includes(q))
        )
        return JSON.stringify(filtered.length > 0 ? filtered : MOCK_RESTAURANTS)
      }
      return JSON.stringify(MOCK_RESTAURANTS)
    }

    case "get_restaurant_menu":
      // Return menu items filtered/associated with the restaurant
      return JSON.stringify({
        restaurantId: args.restaurantId,
        categories: [
          { name: "Recommended", items: MOCK_MENU_ITEMS.slice(0, 3) },
          { name: "Main Course", items: MOCK_MENU_ITEMS.slice(3, 6) },
          { name: "Specials", items: MOCK_MENU_ITEMS.slice(6) },
        ],
      })

    case "search_menu": {
      // Filter menu items by query
      if (args.query) {
        const q = args.query.toLowerCase()
        const filtered = MOCK_MENU_ITEMS.filter(
          (item) => item.name.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        )
        return JSON.stringify(filtered.length > 0 ? filtered : MOCK_MENU_ITEMS.slice(0, 3))
      }
      return JSON.stringify(MOCK_MENU_ITEMS)
    }

    case "get_food_cart":
      return JSON.stringify(MOCK_CART)

    case "update_food_cart":
      // Simulate adding items to cart
      return JSON.stringify({
        ...MOCK_CART,
        restaurantId: args.restaurantId,
        items: (args.items || []).map((item: { itemId: string; quantity: number }) => {
          const menuItem = MOCK_MENU_ITEMS.find((m) => m.id === item.itemId)
          return {
            name: menuItem?.name || "Unknown Item",
            quantity: item.quantity,
            price: menuItem?.price || 0,
            totalPrice: (menuItem?.price || 0) * item.quantity,
          }
        }),
      })

    case "flush_food_cart":
      return JSON.stringify({ success: true })

    case "fetch_food_coupons":
      return JSON.stringify(MOCK_COUPONS)

    case "apply_food_coupon": {
      const coupon = MOCK_COUPONS.find((c) => c.code === args.couponCode)
      return JSON.stringify({
        ...MOCK_CART,
        couponApplied: coupon?.code || args.couponCode,
        discount: coupon?.maxDiscount || 50,
        total: MOCK_CART.subtotal - (coupon?.maxDiscount || 50) + (MOCK_CART.taxes || 0) + (MOCK_CART.deliveryFee || 0),
      })
    }

    case "place_food_order":
      return JSON.stringify({
        orderId: "ORD_" + Math.floor(Math.random() * 9000 + 1000),
        status: "confirmed",
        total: MOCK_CART.total,
      })

    case "get_food_orders":
      return JSON.stringify(MOCK_FOOD_ORDERS)

    case "get_food_order_details":
      return JSON.stringify({
        orderId: args.orderId,
        restaurantName: "Meghana Foods",
        items: [
          { name: "Chicken Dum Biryani", quantity: 2, price: 320, totalPrice: 640 },
        ],
        status: "delivered",
        total: 640,
        deliveryAddress: MOCK_ADDRESSES[0].address,
        createdAt: "2026-05-02T13:30:00Z",
      })

    case "track_food_order":
      return JSON.stringify({
        orderId: args.orderId,
        status: "on_the_way",
        eta: "15 min",
        deliveryPartner: "Rahul S.",
        currentLocation: "Near Koramangala BDA Complex",
      })

    case "report_error_food":
    case "report_error_instamart":
    case "report_error_dineout":
      return JSON.stringify({ success: true, message: "Error reported successfully" })

    // Instamart tools
    case "search_products": {
      if (args.query) {
        const q = args.query.toLowerCase()
        const filtered = MOCK_INSTAMART_PRODUCTS.filter(
          (p) => p.name.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
        return JSON.stringify(filtered.length > 0 ? filtered : MOCK_INSTAMART_PRODUCTS.slice(0, 3))
      }
      return JSON.stringify(MOCK_INSTAMART_PRODUCTS)
    }

    case "your_go_to_items":
      return JSON.stringify(MOCK_INSTAMART_GO_TO_ITEMS)

    case "get_cart":
      return JSON.stringify({
        items: [],
        subtotal: 0,
        total: 0,
      })

    case "update_cart": {
      const cartItems = (args.items || []).map((item: { productId: string; variantId: string; quantity: number }) => {
        const product = MOCK_INSTAMART_PRODUCTS.find((p) => p.id === item.productId)
        const variant = product?.variants.find((v) => v.id === item.variantId)
        return {
          name: product?.name || "Unknown",
          quantity: item.quantity,
          price: variant?.price || 0,
          totalPrice: (variant?.price || 0) * item.quantity,
        }
      })
      const instamartTotal = cartItems.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0)
      return JSON.stringify({
        items: cartItems,
        subtotal: instamartTotal,
        deliveryFee: 15,
        total: instamartTotal + 15,
      })
    }

    case "clear_cart":
      return JSON.stringify({ success: true })

    case "checkout":
      return JSON.stringify({
        orderId: "IM_" + Math.floor(Math.random() * 9000 + 1000),
        status: "confirmed",
        total: 205,
      })

    case "get_orders":
      return JSON.stringify([
        { orderId: "IM_2001", status: "delivered", total: 320, createdAt: "2026-05-01T10:00:00Z" },
      ])

    case "get_order_details":
      return JSON.stringify({
        orderId: args.orderId,
        items: [
          { name: "Amul Paneer 200g", quantity: 1, price: 90 },
          { name: "Maggi Noodles Pack of 4", quantity: 2, price: 112 },
        ],
        status: "delivered",
        total: 202,
      })

    case "track_order":
      return JSON.stringify({
        orderId: args.orderId,
        status: "picked_up",
        eta: "8 min",
        deliveryPartner: "Suresh K.",
      })

    case "create_address":
      return JSON.stringify({ id: "addr_new", label: "New", address: args.address, lat: args.lat, lng: args.lng })

    case "delete_address":
      return JSON.stringify({ success: true })

    // Dineout tools
    case "get_saved_locations":
      return JSON.stringify(MOCK_ADDRESSES)

    case "search_restaurants_dineout": {
      if (args.query) {
        const q = args.query.toLowerCase()
        const filtered = MOCK_DINEOUT_RESTAURANTS.filter(
          (r) => r.name.toLowerCase().includes(q) ||
            r.cuisine?.some((c: string) => c.toLowerCase().includes(q))
        )
        return JSON.stringify(filtered.length > 0 ? filtered : MOCK_DINEOUT_RESTAURANTS)
      }
      return JSON.stringify(MOCK_DINEOUT_RESTAURANTS)
    }

    case "get_restaurant_details":
      return JSON.stringify(MOCK_DINEOUT_DETAILS)

    case "get_available_slots":
      return JSON.stringify(MOCK_DINEOUT_SLOTS)

    case "create_cart_dineout":
      return JSON.stringify(MOCK_BOOKING)

    case "book_table":
      return JSON.stringify(MOCK_BOOKING)

    case "get_booking_status":
      return JSON.stringify(MOCK_BOOKING_STATUS)

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` })
  }
}
