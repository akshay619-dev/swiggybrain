"use client"

interface CartCardProps {
  data: {
    restaurant: string
    items: Array<{ name: string; qty: number; price: number }>
    coupon?: { code: string; discount: number } | null
    total: number
    paymentMethod: string
  }
  onAction?: (message: string) => void
}

export function CartCard({ data, onAction }: CartCardProps) {
  const { restaurant, items, coupon, total, paymentMethod } = data

  return (
    <div className="sb-card animate-enter max-w-sm">
      {/* Restaurant */}
      <p className="text-xs font-semibold text-[#666] uppercase tracking-widest">{restaurant}</p>

      {/* Items */}
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[14px] text-[#ccc]">
              {item.name} <span className="text-[#555]">×{item.qty}</span>
            </span>
            <span className="text-[14px] text-white font-medium">₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#222] my-3" />

      {/* Coupon */}
      {coupon && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-emerald-400">{coupon.code}</span>
          <span className="text-xs text-emerald-400">−₹{coupon.discount}</span>
        </div>
      )}

      {/* Total */}
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold text-white">₹{total}</span>
        <span className="text-xs text-[#555]">
          {paymentMethod === "COD" || paymentMethod === "cod"
            ? "Cash on Delivery"
            : paymentMethod}
        </span>
      </div>

      {/* Warning */}
      <p className="text-xs text-[#555] mt-4">
        ⚠ Orders cannot be cancelled once placed.
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          className="sb-btn-primary flex-1 text-[13px]"
          onClick={() => onAction?.("confirm order")}
        >
          Confirm Order
        </button>
        <button
          className="sb-btn-secondary flex-1 text-[13px]"
          onClick={() => onAction?.("cancel, don't place the order")}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
