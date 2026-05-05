import { BrainCog } from "lucide-react"

/**
 * SwiggyBrain logo mark
 *
 * Uses Lucide's BrainCog (brain with gear = AI) in Swiggy orange,
 * inside a Swiggy-style rounded square.
 *
 * To replace with a custom designed logo later:
 * 1. Export your logo as SVG from Figma/Illustrator
 * 2. Replace the contents of SwiggyBrainLogo below
 * 3. All imports across the app update automatically
 */
export function SwiggyBrainLogo({ size = 40 }: { size?: number }) {
  const padding = Math.round(size * 0.18)
  const iconSize = size - padding * 2

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: "#FF5200",
      }}
    >
      <BrainCog
        className="text-white"
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={1.8}
      />
    </div>
  )
}

/**
 * Wordmark — icon + "SwiggyBrain"
 */
export function LogoFull({ className = "", iconSize = 32 }: { className?: string; iconSize?: number }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <SwiggyBrainLogo size={iconSize} />
      <span className="font-bold text-[15px] tracking-[-0.02em]">
        <span className="text-[#FF5200]">Swiggy</span>
        <span className="text-white">Brain</span>
      </span>
    </div>
  )
}

/**
 * Hero logo — larger, with tagline, for landing/empty states
 */
export function LogoHero({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <SwiggyBrainLogo size={72} />
      <div className="text-center">
        <h2 className="font-bold text-2xl tracking-[-0.02em]">
          <span className="text-[#FF5200]">Swiggy</span>
          <span className="text-white">Brain</span>
        </h2>
        <p className="text-[13px] text-[#666] mt-1.5 tracking-wide">AI-Powered Food Decisions</p>
      </div>
    </div>
  )
}
