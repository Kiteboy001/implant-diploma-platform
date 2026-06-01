import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import ChatWidget from "@/app/components/ChatWidget"

export default async function DashboardPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: (session?.user as any)?.id },
    include: {
      submissions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-dark">
        <p className="text-gray-300">User not found. Please sign in again.</p>
      </div>
    )
  }

  const pendingSubmissions = user.submissions.filter(
    (s: { status: string }) => s.status === "pending"
  ).length
  const underReview = user.submissions.filter(
    (s: { status: string }) => s.status === "under_review"
  ).length
  const approved = user.submissions.filter(
    (s: { status: string }) => s.status === "approved"
  ).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-400 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/tid-logo.svg"
                alt="The Implant Diploma"
                width={160}
                height={32}
                className="h-9 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {(user.name as string)?.split(" ")[0]}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-yeseva)] text-3xl text-gray-900">
            Welcome back, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-600 mt-1">Here&apos;s your diploma progress overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Submissions",
              value: user.submissions.length,
              color: "text-gray-900",
            },
            { label: "Pending", value: pendingSubmissions, color: "text-amber-600" },
            { label: "Under Review", value: underReview, color: "text-brand" },
            { label: "Approved", value: approved, color: "text-emerald-600" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-600 mb-1.5">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid: content + chat */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column: progress + submissions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Programme Progress */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-[family-name:var(--font-yeseva)] text-lg text-gray-900 mb-5">
                Programme Progress
              </h2>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                <div
                  className="bg-brand h-3 rounded-full transition-all duration-700"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="text-sm text-gray-600">
                0% complete — you haven&apos;t started yet.
              </p>
              <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"].map(
                  (m, i) => (
                    <div
                      key={i}
                      className="text-center py-3 px-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-400"
                    >
                      {m}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-[family-name:var(--font-yeseva)] text-lg text-gray-900">
                  Recent Submissions
                </h2>
                <span className="text-sm text-gray-600">
                  {user.submissions.length === 0
                    ? "No submissions yet"
                    : `${user.submissions.length} total`}
                </span>
              </div>
              {user.submissions.length === 0 ? (
                <div className="text-center py-10">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  <p className="text-gray-900 font-semibold mb-1">No submissions yet</p>
                  <p className="text-sm text-gray-500">
                    Once you submit assignments, they&apos;ll appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.submissions.map(
                    (submission: {
                      id: string
                      title: string
                      type: string | null
                      submittedAt: Date | null
                      status: string
                    }) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {submission.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {submission.type?.toUpperCase() || "Assignment"}
                            {submission.submittedAt &&
                              ` • Submitted ${new Date(submission.submittedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            submission.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : submission.status === "under_review"
                              ? "bg-blue-50 text-brand"
                              : submission.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {submission.status.replace("_", " ")}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-[family-name:var(--font-yeseva)] text-lg text-gray-900 mb-4">
                Quick Links
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    ),
                    label: "Materials",
                    href: "#",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    ),
                    label: "Deadlines",
                    href: "#",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    ),
                    label: "Submissions",
                    href: "#",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    ),
                    label: "Website",
                    href: "https://theimplantdiploma.co.uk",
                  },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-100 hover:border-brand/20 hover:bg-brand/5 transition-all group"
                  >
                    <span className="text-brand group-hover:text-brand-light transition-colors">
                      {link.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Chat widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <ChatWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
