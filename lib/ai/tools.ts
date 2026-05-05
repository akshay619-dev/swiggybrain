import type { ToolDefinition } from "@/lib/ai/providers/types"
import { MCPClient } from "@/lib/mcp/client"
import { FoodClient } from "@/lib/mcp/food"
import { InstamartClient } from "@/lib/mcp/instamart"
import { DineoutClient } from "@/lib/mcp/dineout"

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // ─── Food Tools ───────────────────────────────────────────────────────────

  {
    type: "function",
    function: {
      name: "get_addresses",
      description:
        "Retrieve all saved delivery addresses for the user's Swiggy Food account. Call this before searching restaurants or placing food orders to obtain a valid addressId.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_restaurants",
      description:
        "Search for food restaurants available for delivery to a given address. Optionally filter by a search query (e.g. cuisine, restaurant name, or dish). Returns a list of restaurants with their IDs, names, ratings, and estimated delivery info.",
      parameters: {
        type: "object",
        properties: {
          addressId: {
            type: "string",
            description: "The delivery address ID (obtained from get_addresses).",
          },
          query: {
            type: "string",
            description: "Optional search term to filter restaurants by name, cuisine, or dish.",
          },
        },
        required: ["addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_restaurant_menu",
      description:
        "Fetch the full menu for a specific restaurant, including all categories, items, prices, and available variants or add-ons. Use this after selecting a restaurant to browse what can be ordered.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The unique identifier of the restaurant.",
          },
        },
        required: ["restaurantId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_menu",
      description:
        "Search for specific dishes or menu items across restaurants available at a delivery address. Useful when the user knows what dish they want but not which restaurant. Returns matching items with their restaurant info and prices.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The dish or menu item to search for (e.g. 'biryani', 'paneer butter masala').",
          },
          addressId: {
            type: "string",
            description: "The delivery address ID (obtained from get_addresses).",
          },
        },
        required: ["query", "addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_food_cart",
      description:
        "Retrieve the current Swiggy Food cart contents, including all items, quantities, prices, applied coupons, and the total amount. Use this to show the user what is in their cart before checkout.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_food_cart",
      description:
        "Add, update, or remove items in the Swiggy Food cart. All items must be from the same restaurant. Pass quantity 0 to remove an item. Supports variants (e.g. size) and add-ons.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The ID of the restaurant all items belong to.",
          },
          items: {
            type: "array",
            description: "List of items to set in the cart.",
            items: {
              type: "object",
              properties: {
                itemId: {
                  type: "string",
                  description: "The menu item ID.",
                },
                quantity: {
                  type: "number",
                  description: "Desired quantity (0 removes the item).",
                },
                variantId: {
                  type: "string",
                  description: "Optional variant ID (e.g. size or portion).",
                },
                addonIds: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional list of add-on IDs to include.",
                },
              },
              required: ["itemId", "quantity"],
            },
          },
        },
        required: ["restaurantId", "items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "flush_food_cart",
      description:
        "Clear all items from the Swiggy Food cart. Use when the user wants to start over or switch to a different restaurant.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_food_coupons",
      description:
        "Retrieve all available discount coupons applicable to the current Swiggy Food cart. Returns coupon codes, discount details, and eligibility conditions.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "apply_food_coupon",
      description:
        "Apply a discount coupon to the Swiggy Food cart. The cart must have items before applying a coupon. Returns the updated cart with the discount applied.",
      parameters: {
        type: "object",
        properties: {
          couponCode: {
            type: "string",
            description: "The coupon code to apply (e.g. 'SAVE50').",
          },
        },
        required: ["couponCode"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "place_food_order",
      description:
        "Place the Swiggy Food order using the current cart contents. Defaults to Cash on Delivery (COD). Only call this after confirming cart contents and delivery address with the user.",
      parameters: {
        type: "object",
        properties: {
          paymentMethod: {
            type: "string",
            description: "Payment method for the order. Defaults to 'COD' (Cash on Delivery).",
            default: "COD",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_food_orders",
      description:
        "Retrieve the user's Swiggy Food order history — a list of past and current orders with their IDs, restaurant names, statuses, and order totals.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_food_order_details",
      description:
        "Get the full details of a specific Swiggy Food order, including items ordered, prices, delivery address, payment method, and current status.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique order ID to fetch details for.",
          },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "track_food_order",
      description:
        "Get real-time tracking information for an active Swiggy Food order, including preparation status, delivery partner details, and estimated arrival time.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique order ID to track.",
          },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "report_error_food",
      description:
        "Report an issue or error related to Swiggy Food (e.g. wrong items delivered, payment problem, app error). Use this only for Food-related issues.",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "A detailed description of the issue or error to report.",
          },
        },
        required: ["description"],
      },
    },
  },

  // ─── Instamart Tools ──────────────────────────────────────────────────────

  {
    type: "function",
    function: {
      name: "get_addresses_instamart",
      description:
        "Retrieve all saved delivery addresses for the user's Swiggy Instamart (grocery delivery) account. Call this before searching products or placing grocery orders.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_address",
      description:
        "Add a new delivery address to the user's Instamart account using a text address string and GPS coordinates.",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "Full text of the delivery address (e.g. '42 MG Road, Bengaluru, 560001').",
          },
          lat: {
            type: "number",
            description: "Latitude of the address location.",
          },
          lng: {
            type: "number",
            description: "Longitude of the address location.",
          },
        },
        required: ["address", "lat", "lng"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_address",
      description:
        "Remove a saved delivery address from the user's Instamart account by its ID.",
      parameters: {
        type: "object",
        properties: {
          addressId: {
            type: "string",
            description: "The ID of the address to delete.",
          },
        },
        required: ["addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search for grocery or household products available on Swiggy Instamart for delivery to a given address. Returns a list of matching products with names, prices, and availability.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The product or category to search for (e.g. 'milk', 'bread', 'shampoo').",
          },
          addressId: {
            type: "string",
            description: "The delivery address ID (obtained from get_addresses_instamart).",
          },
        },
        required: ["query", "addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "your_go_to_items",
      description:
        "Retrieve the user's frequently ordered or saved Instamart products for a given delivery address. Useful for quickly reordering regular grocery items.",
      parameters: {
        type: "object",
        properties: {
          addressId: {
            type: "string",
            description: "The delivery address ID (obtained from get_addresses_instamart).",
          },
        },
        required: ["addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cart",
      description:
        "Retrieve the current Swiggy Instamart cart contents, including all grocery items, quantities, prices, and the total amount.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_cart",
      description:
        "Add, update, or remove items in the Swiggy Instamart grocery cart. Pass quantity 0 to remove an item. Each item requires a productId and variantId.",
      parameters: {
        type: "object",
        properties: {
          items: {
            type: "array",
            description: "List of items to set in the Instamart cart.",
            items: {
              type: "object",
              properties: {
                productId: {
                  type: "string",
                  description: "The product ID.",
                },
                variantId: {
                  type: "string",
                  description: "The specific variant ID (e.g. pack size).",
                },
                quantity: {
                  type: "number",
                  description: "Desired quantity (0 removes the item).",
                },
              },
              required: ["productId", "variantId", "quantity"],
            },
          },
        },
        required: ["items"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "clear_cart",
      description:
        "Remove all items from the Swiggy Instamart grocery cart. Use when the user wants to start a fresh grocery order.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "checkout",
      description:
        "Initiate checkout for the current Swiggy Instamart cart. This prepares the order for payment and confirms delivery details. Call get_cart first to review contents before checking out.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_orders",
      description:
        "Retrieve the user's Swiggy Instamart order history — a list of past and current grocery orders with their IDs, statuses, and totals.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_details",
      description:
        "Get the full details of a specific Swiggy Instamart order, including all products ordered, quantities, prices, delivery address, and current status.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique Instamart order ID to fetch details for.",
          },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "track_order",
      description:
        "Get real-time tracking information for an active Swiggy Instamart grocery order, including packing status, delivery partner details, and estimated arrival time.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The unique Instamart order ID to track.",
          },
        },
        required: ["orderId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "report_error_instamart",
      description:
        "Report an issue or error related to Swiggy Instamart (e.g. missing items, damaged products, delivery problem). Use this only for Instamart grocery-related issues.",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "A detailed description of the issue or error to report.",
          },
        },
        required: ["description"],
      },
    },
  },

  // ─── Dineout Tools ────────────────────────────────────────────────────────

  {
    type: "function",
    function: {
      name: "get_saved_locations",
      description:
        "Retrieve the user's saved locations for Swiggy Dineout (restaurant table booking). Returns location IDs and names used to search for dine-in restaurants nearby.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_restaurants_dineout",
      description:
        "Search for restaurants available for dine-in table booking near a saved location. Optionally filter by cuisine, restaurant name, or other search terms. Returns restaurant IDs, names, ratings, and booking availability.",
      parameters: {
        type: "object",
        properties: {
          locationId: {
            type: "string",
            description: "The saved location ID (obtained from get_saved_locations).",
          },
          query: {
            type: "string",
            description: "Optional search term to filter by restaurant name or cuisine.",
          },
        },
        required: ["locationId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_restaurant_details",
      description:
        "Get detailed information about a specific Dineout restaurant including its menu, photos, timings, cuisine types, pricing, and table booking policies.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The unique ID of the restaurant to get details for.",
          },
        },
        required: ["restaurantId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_available_slots",
      description:
        "Check available time slots for booking a table at a Dineout restaurant. Optionally specify a date and number of guests to filter relevant slots.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The unique ID of the restaurant to check slots for.",
          },
          date: {
            type: "string",
            description: "Optional date for the reservation in YYYY-MM-DD format. Defaults to today.",
          },
          guests: {
            type: "number",
            description: "Optional number of guests to filter slots by table capacity.",
          },
        },
        required: ["restaurantId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_cart_dineout",
      description:
        "Create a Dineout booking cart for a specific restaurant, time slot, and number of guests. This reserves the slot temporarily before final confirmation. Use before book_table.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The unique ID of the restaurant to book.",
          },
          slotTime: {
            type: "string",
            description: "The selected time slot for the reservation (as returned by get_available_slots).",
          },
          guests: {
            type: "number",
            description: "Number of guests for the table booking.",
          },
        },
        required: ["restaurantId", "slotTime", "guests"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_table",
      description:
        "Confirm and finalize a table reservation at a Dineout restaurant for the specified time slot and number of guests. Only call this after the user has reviewed and confirmed the booking details.",
      parameters: {
        type: "object",
        properties: {
          restaurantId: {
            type: "string",
            description: "The unique ID of the restaurant to book.",
          },
          slotTime: {
            type: "string",
            description: "The selected time slot for the reservation.",
          },
          guests: {
            type: "number",
            description: "Number of guests for the table booking.",
          },
        },
        required: ["restaurantId", "slotTime", "guests"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_booking_status",
      description:
        "Check the current status of a Dineout table reservation using the booking ID. Returns confirmation status, restaurant details, and reservation time.",
      parameters: {
        type: "object",
        properties: {
          bookingId: {
            type: "string",
            description: "The unique booking ID to check the status of.",
          },
        },
        required: ["bookingId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "report_error_dineout",
      description:
        "Report an issue or error related to Swiggy Dineout (e.g. booking not confirmed, restaurant closed, wrong slot booked). Use this only for Dineout table booking issues.",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "A detailed description of the issue or error to report.",
          },
        },
        required: ["description"],
      },
    },
  },
]

export async function executeToolCall(
  toolName: string,
  argsJson: string,
  token: string
): Promise<string> {
  if (process.env.MOCK_MCP === "true") {
    const { executeMockToolCall } = await import("@/lib/mcp/mock-client")
    return executeMockToolCall(toolName, argsJson)
  }

  const args = JSON.parse(argsJson)
  const food = new FoodClient(new MCPClient("food", token))
  const instamart = new InstamartClient(new MCPClient("instamart", token))
  const dineout = new DineoutClient(new MCPClient("dineout", token))

  try {
    let result: unknown

    switch (toolName) {
      // Food tools
      case "get_addresses":
        result = await food.getAddresses()
        break
      case "search_restaurants":
        result = await food.searchRestaurants(args.addressId, args.query)
        break
      case "get_restaurant_menu":
        result = await food.getRestaurantMenu(args.restaurantId)
        break
      case "search_menu":
        result = await food.searchMenu(args.query, args.addressId)
        break
      case "get_food_cart":
        result = await food.getFoodCart()
        break
      case "update_food_cart":
        result = await food.updateFoodCart(args.restaurantId, args.items)
        break
      case "flush_food_cart":
        result = await food.flushFoodCart()
        break
      case "fetch_food_coupons":
        result = await food.fetchFoodCoupons()
        break
      case "apply_food_coupon":
        result = await food.applyFoodCoupon(args.couponCode)
        break
      case "place_food_order":
        result = await food.placeFoodOrder(args.paymentMethod ?? "COD")
        break
      case "get_food_orders":
        result = await food.getFoodOrders()
        break
      case "get_food_order_details":
        result = await food.getFoodOrderDetails(args.orderId)
        break
      case "track_food_order":
        result = await food.trackFoodOrder(args.orderId)
        break
      case "report_error_food":
        result = await food.reportError(args.description)
        break

      // Instamart tools
      case "get_addresses_instamart":
        result = await instamart.getAddresses()
        break
      case "create_address":
        result = await instamart.createAddress(args.address, args.lat, args.lng)
        break
      case "delete_address":
        result = await instamart.deleteAddress(args.addressId)
        break
      case "search_products":
        result = await instamart.searchProducts(args.query, args.addressId)
        break
      case "your_go_to_items":
        result = await instamart.getGoToItems(args.addressId)
        break
      case "get_cart":
        result = await instamart.getCart()
        break
      case "update_cart":
        result = await instamart.updateCart(args.items)
        break
      case "clear_cart":
        result = await instamart.clearCart()
        break
      case "checkout":
        result = await instamart.checkout()
        break
      case "get_orders":
        result = await instamart.getOrders()
        break
      case "get_order_details":
        result = await instamart.getOrderDetails(args.orderId)
        break
      case "track_order":
        result = await instamart.trackOrder(args.orderId)
        break
      case "report_error_instamart":
        result = await instamart.reportError(args.description)
        break

      // Dineout tools
      case "get_saved_locations":
        result = await dineout.getSavedLocations()
        break
      case "search_restaurants_dineout":
        result = await dineout.searchRestaurants(args.locationId, args.query)
        break
      case "get_restaurant_details":
        result = await dineout.getRestaurantDetails(args.restaurantId)
        break
      case "get_available_slots":
        result = await dineout.getAvailableSlots(args.restaurantId, args.date, args.guests)
        break
      case "create_cart_dineout":
        result = await dineout.createCart(args.restaurantId, args.slotTime, args.guests)
        break
      case "book_table":
        result = await dineout.bookTable(args.restaurantId, args.slotTime, args.guests)
        break
      case "get_booking_status":
        result = await dineout.getBookingStatus(args.bookingId)
        break
      case "report_error_dineout":
        result = await dineout.reportError(args.description)
        break

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` })
    }

    return JSON.stringify(result ?? { success: true })
  } catch (error) {
    return JSON.stringify({
      error: error instanceof Error ? error.message : "Tool execution failed",
    })
  }
}
