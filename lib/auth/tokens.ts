import { cookies } from "next/headers"

const IS_PROD = process.env.NODE_ENV === "production"

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("swiggy_token", token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    maxAge: 432000, // 5 days
    path: "/",
  })
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("swiggy_token")
  return cookie?.value ?? null
}

export async function clearToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("swiggy_token")
}

export async function setVerifier(verifier: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("pkce_verifier", verifier, {
    httpOnly: true,
    maxAge: 300, // 5 minutes
    path: "/",
  })
}

export async function getVerifier(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("pkce_verifier")
  if (!cookie) return null
  const value = cookie.value
  cookieStore.delete("pkce_verifier")
  return value
}

export async function setState(state: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    maxAge: 300, // 5 minutes
    path: "/",
  })
}

export async function getState(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("oauth_state")
  if (!cookie) return null
  const value = cookie.value
  cookieStore.delete("oauth_state")
  return value
}
