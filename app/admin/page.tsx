import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    totalCohorts,
    pendingSubmissions,
    recentSubmissions,
    cohorts,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "delegate" } }),
    prisma.cohort.count(),
    prisma.submission.count({ where: { status: "submitted" } }),
    prisma.submission.findMany({
      where: { status: { in: ["submitted", "under_review"] } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { submittedAt: "desc" },
      take: 10,
    }),
    prisma.cohort.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const approvedThisWeek = await prisma.submission.count({
    where: {
      status: "approved",
      updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[(family-name:var(--font-yeseva))] text-3xl text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor student progress and review submissions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Students",
            value: totalStudents,
            color: "text-gray-900",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            ),
          },
          {
            label: "Cohorts",
            value: totalCohorts,
            color: "text-brand",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75-4.5c.621 0 1.125.504 1.125 1.125V6.75m-1.125-3h1.5c.621 0 1.125.504 1.125 1.125v1.5" />
              </svg>
            ),
          },
          {
            label: "Pending Reviews",
            value: pendingSubmissions,
            color: "text-amber-600",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ),
          },
          {
            label: "Approved This Week",
            value: approvedThisWeek,
            color: "text-emerald-600",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ),
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cohorts + Pending Submissions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cohorts */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900">
                Cohorts
              </h2>
              <span className="text-sm text-gray-500">{cohorts.length} total</span>
            </div>

            {cohorts.length === 0 ? (
              <p className="text-gray-500 text-sm py-6 text-center">
                No cohorts created yet.
              </p>
            ) : (
              <div className="space-y-3">
                {cohorts.map((cohort) => (
                  <div
                    key={cohort.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cohort.name || "Unnamed Cohort"}
                      </p>
                      {cohort.startDate && (
                        <p className="text-sm text-gray-600">
                          Started {new Date(cohort.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {cohort._count.users} student{cohort._count.users !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Submissions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900">
                Submissions Awaiting Review
              </h2>
              <Link
                href="/admin/students"
                className="text-sm text-brand hover:text-brand-light transition-colors font-medium"
              >
                View all students →
              </Link>
            </div>

            {recentSubmissions.length === 0 ? (
              <p className="text-gray-500 text-sm py-6 text-center">
                No submissions awaiting review.
              </p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {submission.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {submission.user.name || submission.user.email}
                        {submission.submittedAt &&
                          ` • ${new Date(submission.submittedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        submission.status === "under_review"
                          ? "bg-blue-50 text-brand"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {submission.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/students"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/20 hover:bg-brand/5 transition-all group"
              >
                <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">
                  Browse Students
                </span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/20 hover:bg-brand/5 transition-all group"
              >
                <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">
                  Delegate Dashboard
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900 mb-4">
              At a Glance
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total submissions</span>
                <span className="font-semibold text-gray-900">
                  {recentSubmissions.length + approvedThisWeek}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average per student</span>
                <span className="font-semibold text-gray-900">
                  {totalStudents > 0
                    ? Math.round(
                        ((recentSubmissions.length + approvedThisWeek) /
                          totalStudents) *
                          10
                      ) / 10
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Review queue</span>
                <span className="font-semibold text-amber-600">
                  {pendingSubmissions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
