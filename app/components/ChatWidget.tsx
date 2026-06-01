"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "How am I doing with my progress?",
  "What does Module 4 cover?",
  "What do I need for a CBDA submission?",
  "When should I start my case portfolio?",
  "Give me study tips for the viva exam",
]

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI study coach for The Implant Diploma. I can help with module prep, case portfolios, assessment requirements, and staying on track. What can I help with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (text?: string) => {
    const message = (text ?? input).trim()
    if (!message || loading) return

    const userMsg: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()
      const reply = data.reply || "Sorry, I couldn't process that. Please try again."

      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-dark to-brand-dark text-white">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          H
        </div>
        <div>
          <p className="text-sm font-semibold">Hermes — AI Study Coach</p>
          <p className="text-xs text-white/60">Powered by The Implant Diploma</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <span className="text-xs text-white/60">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                H
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%] ${
                msg.role === "user"
                  ? "bg-brand text-white rounded-br-md"
                  : "bg-white text-gray-700 rounded-bl-md border border-gray-100 shadow-sm"
              }`}
            >
              {/* Render newlines */}
              {msg.content.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.content.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                Y
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              H
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions (when empty) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-brand hover:text-brand transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your diploma..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50 transition-shadow"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
