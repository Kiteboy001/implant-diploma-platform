"use client"

import { login } from "@/app/actions/auth"
import { useActionState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, {})

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-dark px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/tid-logo.svg"
              alt="The Implant Diploma"
              width={200}
              height={40}
              className="h-10 w-auto mx-auto mb-6"
              priority
            />
          </Link>
          <h1 className="font-[family-name:var(--font-yeseva)] text-2xl md:text-3xl text-white">
            Welcome back
          </h1>
          <p className="text-gray-300 mt-2">Sign in to your delegate portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                placeholder="you@example.com"
              />
              {state?.errors?.email && (
                <p className="text-red-600 text-sm mt-1.5">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                placeholder="••••••••"
              />
              {state?.errors?.password && (
                <p className="text-red-600 text-sm mt-1.5">{state.errors.password[0]}</p>
              )}
            </div>

            {state?.message && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {state.message}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 px-4 bg-brand text-white rounded-lg font-semibold hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-brand font-semibold hover:text-brand-light transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
