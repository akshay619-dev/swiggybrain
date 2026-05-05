"use client"

interface DineoutCardProps {
  data: {
    restaurant: { name: string; rating?: number; cuisine?: string; address?: string }
    slot: { date: string; time: string; guests: number }
    deals?: string[] | null
    pricePerPerson?: number
  }
  onAction?: (message: string) => void
}

export function DineoutCard({ data, onAction }: DineoutCardProps) {
  const { restaurant, slot, deals, pricePerPerson } = data

  return (
    <div className="sb-card animate-enter max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-white">{restaurant.name}</h3>
        {restaurant.rating != null && (
          <span className="text-xs font-medium text-white bg-green-600 rounded-md px-1.5 py-0.5">
            ★ {restaurant.rating}
          </span>
        )}
      </div>

      {restaurant.cuisine && (
        <p className="text-xs text-[#777] mt-1">{restaurant.cuisine}</p>
      )}
      {restaurant.address && (
        <p className="text-xs text-[#555] mt-0.5">{restaurant.address}</p>
      )}

      {/* Slot */}
      <div className="bg-[#1c1c1c] border border-[#252525] rounded-lg px-3 py-2.5 mt-3">
        <p className="text-[13px] text-[#ccc]">
          📅 {slot.date} · {slot.time} · {slot.guests} guest{slot.guests !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Deals */}
      {deals && deals.length > 0 && (
        <div className="mt-3 space-y-1">
          {deals.map((deal, i) => (
            <p key={i} className="text-[13px] text-emerald-400">✓ {deal}</p>
          ))}
        </div>
      )}

      {/* Price */}
      {pricePerPerson != null && (
        <p className="text-[13px] text-[#777] mt-3">
          ~<span className="text-white font-semibold">₹{pricePerPerson}</span> per person
        </p>
      )}

      {/* Action */}
      <button
        className="sb-btn-secondary w-full mt-4 text-[13px]"
        onClick={() => onAction?.("book this table")}
      >
        Book Table
      </button>
    </div>
  )
}
