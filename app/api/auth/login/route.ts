import { redirect } from "next/navigation"
import { generatePKCE, generateState } from "@/lib/auth/pkce"
import { setVerifier, setState } from "@/lib/auth/tokens"

export async function GET() {
  const { verifier, challenge } = generatePKCE()
  const state = generateState()

  await setVerifier(verifier)
  await setState(state)

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SWIGGY_CLIENT_ID!,
    redirect_uri: process.env.SWIGGY_REDIRECT_URI!,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    scope: "mcp:tools",
  })

  redirect(`https://mcp.swiggy.com/auth/authorize?${params.toString()}`)
}
