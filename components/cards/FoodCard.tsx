"use client"

interface FoodCardProps {
  data: {
    restaurant: { name: string; rating?: number; eta?: string; distance?: string }
    dish: { name: string; price: number; description?: string }
    coupon?: { code: string; discount: string; effectivePrice: number } | null
    reasoning?: string
  }
  onAction?: (message: string) => void
}

export function FoodCard({ data, onAction }: FoodCardProps) {
  const { restaurant, dish, coupon, reasoning } = data

  return (
    <div className="sb-card animate-enter max-w-sm">
      {/* Restaurant */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-white">{restaurant.name}</h3>
        {restaurant.rating != null && (
          <span className="text-xs font-medium text-white bg-green-600 rounded-md px-1.5 py-0.5">
            ★ {restaurant.rating}
          </span>
        )}
      </div>

      {restaurant.eta && (
        <p className="text-xs text-[#666] mt-1">
          {restaurant.eta}{restaurant.distance ? ` · ${restaurant.distance}` : ""}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-[#222] my-3" />

      {/* Dish */}
      <p className="text-[15px] font-medium text-white">{dish.name}</p>
      {dish.description && (
        <p className="text-[13px] text-[#777] mt-1 line-clamp-2">{dish.description}</p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2 mt-3">
        {coupon ? (
          <>
            <span className="text-xl font-bold text-[#FF5200]">₹{coupon.effectivePrice}</span>
            <span className="text-sm text-[#555] line-through">₹{dish.price}</span>
          </>
        ) : (
          <span className="text-xl font-bold text-white">₹{dish.price}</span>
        )}
      </div>

      {/* Coupon tag */}
      {coupon && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className="inline-flex items-center text-xs font-medium text-[#FF5200] bg-[#FF5200]/8 border border-[#FF5200]/15 rounded-md px-2 py-0.5">
            {coupon.code}
          </span>
          <span className="text-xs text-[#777]">{coupon.discount}</span>
        </div>
      )}

      {/* Reasoning */}
      {reasoning && (
        <p className="text-[13px] text-[#666] mt-3 italic">{reasoning}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          className="sb-btn-primary flex-1 text-[13px]"
          onClick={() => onAction?.("add to cart")}
        >
          Add to Cart
        </button>
        <button
          className="sb-btn-secondary flex-1 text-[13px]"
          onClick={() => onAction?.("show me other options")}
        >
          Other options
        </button>
      </div>
    </div>
  )
}
