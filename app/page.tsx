import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SwiggyBrainLogo, LogoFull } from "@/components/Logo";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = params.error as string | undefined;

  return (
    <main className="min-h-screen landing-bg text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <LogoFull />
        </div>
        <a
          href="/api/auth/login"
          className="text-[13px] text-[#999] hover:text-white transition-colors hidden sm:block"
        >
          Sign in
        </a>
      </nav>

      {/* Hero — Two column layout */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-[40px] sm:text-[52px] leading-[1.08] font-bold tracking-tight">
              Your food,{" "}
              <span className="text-[#FF5200]">decided in seconds</span>
            </h1>

            <p className="text-[#888] text-[16px] leading-relaxed max-w-md">
              Tell <span className="text-[#FF5200] font-semibold">SwiggyBrain </span> what you&apos;re craving. It searches every restaurant, compares prices, applies the best coupon, and recommends exactly what to order.
            </p>

            {/* Error */}
            {error && (
              <Alert variant="destructive" className="border-red-800 bg-red-950/40 text-left">
                <AlertCircle className="size-4" />
                <AlertTitle>Authentication failed</AlertTitle>
                <AlertDescription>
                  {error === "auth_failed"
                    ? "Could not sign in with Swiggy. Please try again."
                    : "Something went wrong. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/api/auth/login"
                className="sb-btn-primary h-12 px-7 text-[15px] rounded-xl gap-2"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </a>
              {process.env.DEV_MODE === "true" && (
                <a
                  href="/chat"
                  className="sb-btn-secondary h-12 px-6 text-[14px] rounded-xl"
                >
                  Try demo
                </a>
              )}
            </div>
          </div>

          {/* Right — Product preview (mock chat) */}
          <div className="relative">
            {/* Subtle glow behind the card */}
            <div className="absolute -inset-4 bg-[#FF5200]/[0.04] rounded-3xl blur-3xl" />

            <div className="relative bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Mock header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a]">
                <SwiggyBrainLogo size={20} />
                <span className="text-xs font-medium text-[#999]">SwiggyBrain</span>
              </div>

              {/* Mock conversation */}
              <div className="p-4 space-y-4 text-[13px]">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-[#FF5200] text-white rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[70%]">
                    lunch under 300, not biryani
                  </div>
                </div>

                {/* Assistant text */}
                <div className="text-[#aaa] leading-relaxed">
                  Here&apos;s a great pick for you:
                </div>

                {/* Mock FoodCard */}
                <div className="bg-[#161616] border border-[#232323] rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-white">The Bowl Company</span>
                    <span className="text-[10px] font-medium text-white bg-green-600 rounded px-1.5 py-0.5">★ 4.4</span>
                  </div>
                  <p className="text-[11px] text-[#666] mt-0.5">20-25 min · 2.1 km</p>

                  <div className="h-px bg-[#222] my-2.5" />

                  <p className="text-[13px] font-medium text-white">Chicken Shawarma Plate</p>
                  <p className="text-[11px] text-[#666] mt-0.5">Lebanese-style grilled chicken with garlic sauce, hummus</p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-[16px] font-bold text-[#FF5200]">₹228</span>
                    <span className="text-[12px] text-[#555] line-through">₹290</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-medium text-[#FF5200] bg-[#FF5200]/10 border border-[#FF5200]/15 rounded px-1.5 py-0.5">SWIGGYIT</span>
                    <span className="text-[10px] text-[#666]">20% off</span>
                  </div>

                  <p className="text-[11px] text-[#555] mt-2 italic">You had biryani twice this week — this is lighter and ₹62 cheaper after coupon.</p>

                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 h-8 bg-[#FF5200] rounded-lg flex items-center justify-center text-white text-[11px] font-semibold">Add to Cart</div>
                    <div className="flex-1 h-8 border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] text-[11px]">Other options</div>
                  </div>
                </div>
              </div>

              {/* Mock input */}
              <div className="px-4 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-9 bg-[#151515] border border-[#222] rounded-xl px-3 flex items-center">
                    <span className="text-[12px] text-[#444]">What are you in the mood for?</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#FF5200] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <footer className="border-t border-[#161616] py-5 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <LogoFull />
          <span className="text-[12px] text-[#444]">Swiggy Builders Club 2026</span>
        </div>
      </footer>
    </main>
  );
}
