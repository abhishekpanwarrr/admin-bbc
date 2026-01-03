import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    const response = NextResponse.json({ success: true })
    response.cookies.set("auth_token", token, {
      httpOnly: false, // Allow client-side access for SPA compatibility
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to set token" }, { status: 400 })
  }
}
