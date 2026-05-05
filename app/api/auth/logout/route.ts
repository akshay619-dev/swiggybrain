import { redirect } from "next/navigation"
import { clearToken } from "@/lib/auth/tokens"

export async function GET() {
  await clearToken()
  redirect("/")
}
