import { NextRequest, NextResponse } from "next/server"

const HERMES_API_URL = process.env.HERMES_API_URL || "http://127.0.0.1:8642"
const HERMES_API_KEY = process.env.HERMES_API_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HERMES_API_KEY}`,
    }

    // Skip ngrok browser warning when using ngrok tunnels
    if (HERMES_API_URL.includes("ngrok")) {
      headers["ngrok-skip-browser-warning"] = "true"
    }

    const response = await fetch(`${HERMES_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "hermes-agent",
        messages: [
          {
            role: "system",
            content: "You are the Implant Diploma AI study coach. Be warm, encouraging, and practical. Load the implant-diploma-coach skill for knowledge about the programme. Never give clinical advice. Always defer patient-specific questions to tutors.",
          },
          { role: "user", content: message },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Hermes API error:", response.status, error)
      return NextResponse.json(
        { error: "Agent unavailable" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const reply =
      data.choices?.[0]?.message?.content || "I'm not sure about that."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to reach agent" },
      { status: 500 }
    )
  }
}
