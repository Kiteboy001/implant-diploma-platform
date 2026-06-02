import { NextRequest, NextResponse } from "next/server"

const HERMES_API_URL =
  process.env.HERMES_API_URL || "https://implant-diploma-agent-production.up.railway.app"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await fetch(`${HERMES_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Agent unavailable" }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json({ reply: data.reply || "I couldn't process that." })
  } catch {
    return NextResponse.json({ error: "Failed to reach agent" }, { status: 500 })
  }
}
