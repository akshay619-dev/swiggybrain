import { type NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { getState, getVerifier, setToken } from "@/lib/auth/tokens"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const incomingState = searchParams.get("state")

  let success = false

  if (code && incomingState) {
    const savedState = await getState()
    const verifier = await getVerifier()

    if (savedState && savedState === incomingState && verifier) {
      const tokenRes = await fetch("https://mcp.swiggy.com/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          client_id: process.env.SWIGGY_CLIENT_ID!,
          redirect_uri: process.env.SWIGGY_REDIRECT_URI!,
        }),
      })

      if (tokenRes.ok) {
        const data = await tokenRes.json()
        const accessToken: string = data.access_token

        if (accessToken) {
          await setToken(accessToken)
          success = true
        }
      }
    }
  }

  if (!success) {
    redirect("/?error=auth_failed")
  }

  redirect("/chat")
}
