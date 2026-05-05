"use client"

interface ComparisonCardProps {
  data: {
    order: {
      restaurant: string
      dish: string
      price: number
      coupon?: string | null
      effectivePrice: number
      eta: string
    }
    cook: {
      ingredients: Array<{ name: string; price: number }>
      totalCost: number
      prepTime: string
    }
    savings: number
  }
  onAction?: (message: string) => void
}

export function ComparisonCard({ data, onAction }: ComparisonCardProps) {
  const { order, cook, savings } = data

  return (
    <div className="sb-card animate-enter max-w-lg">
      <p className="text-xs font-semibold text-[#666] uppercase tracking-widest">Cook vs Order</p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Order */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#252525]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">🛵</span>
            <span className="text-[13px] font-semibold text-white">Order</span>
          </div>
          <p className="text-[13px] text-[#888]">{order.restaurant}</p>
          <p className="text-[13px] text-[#aaa] mt-0.5">{order.dish}</p>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-lg font-bold text-[#FF5200]">₹{order.effectivePrice}</span>
            {order.coupon && order.price !== order.effectivePrice && (
              <span className="text-xs text-[#555] line-through">₹{order.price}</span>
            )}
          </div>
          <p className="text-xs text-[#555] mt-1">{order.eta}</p>
        </div>

        {/* Cook */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#252525]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">👨‍🍳</span>
            <span className="text-[13px] font-semibold text-white">Cook</span>
          </div>
          <div className="space-y-1">
            {cook.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between text-[12px]">
                <span className="text-[#888]">{ing.name}</span>
                <span className="text-[#aaa]">₹{ing.price}</span>
              </div>
            ))}
          </div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-lg font-bold text-emerald-400">₹{cook.totalCost}</span>
          </div>
          <p className="text-xs text-[#555] mt-1">{cook.prepTime}</p>
        </div>
      </div>

      {/* Savings */}
      {savings > 0 && (
        <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-3 py-2 mt-3 text-center">
          <span className="text-sm font-medium text-emerald-400">You save ₹{savings} by cooking</span>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          className="sb-btn-primary text-[13px]"
          onClick={() => onAction?.("order it")}
        >
          Order it
        </button>
        <button
          className="sb-btn-secondary text-[13px]"
          onClick={() => onAction?.("I'll cook it, add ingredients to Instamart cart")}
        >
          Cook it
        </button>
      </div>
    </div>
  )
}
