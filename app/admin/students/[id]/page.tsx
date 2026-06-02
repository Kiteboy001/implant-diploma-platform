import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      cohort: { select: { name: true, id: true } },
      submissions: {
        orderBy: { createdAt: "desc" },
        include: {
          module: { select: { name: true } },
        },
      },
      progress: {
        include: {
          module: { select: { name: true, order: true } },
        },
        orderBy: { module: { order: "asc" } },
      },
    },
  });

  if (!student || student.role !== "delegate") {
    notFound();
  }

  const pendingCount = student.submissions.filter(
    (s) => s.status === "submitted" || s.status === "under_review"
  ).length;
  const approvedCount = student.submissions.filter(
    (s) => s.status === "approved"
  ).length;
  const avgProgress =
    student.progress.length > 0
      ? Math.round(
          student.progress.reduce(
            (sum, p) => sum + p.completionPercentage,
            0
          ) / student.progress.length
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-brand transition-colors">
          Admin
        </Link>
        <span>/</span>
        <Link
          href="/admin/students"
          className="hover:text-brand transition-colors"
        >
          Students
        </Link>
        <span>/</span>
        <span className="text-gray-900">{student.name || student.email}</span>
      </div>

      {/* Student Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-[(family-name:var(--font-yeseva))] text-2xl text-gray-900">
              {student.name || "Unnamed Student"}
            </h1>
            <p className="text-gray-600 mt-1">{student.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/students`}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Cohort
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {student.cohort?.name || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Joined
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
          {student.phone && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Phone
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {student.phone}
              </p>
            </div>
          )}
          {student.gdcNumber && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                GDC Number
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {student.gdcNumber}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Total Submissions
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {student.submissions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Avg Progress",
            value: `${avgProgress}%`,
            color: "text-brand",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            color: "text-amber-600",
          },
          { label: "Approved", value: approvedCount, color: "text-emerald-600" },
          {
            label: "Rejected",
            value: student.submissions.filter((s) => s.status === "rejected")
              .length,
            color: "text-red-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-1.5">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress & Submissions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Module Progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900 mb-5">
            Module Progress
          </h2>

          {student.progress.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No progress data yet.
            </p>
          ) : (
            <div className="space-y-4">
              {student.progress.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">
                      {p.module?.name || `Module`}
                    </span>
                    <span className="text-gray-600">
                      {p.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        p.completionPercentage === 100
                          ? "bg-emerald-500"
                          : p.completionPercentage > 50
                          ? "bg-brand"
                          : p.completionPercentage > 0
                          ? "bg-amber-400"
                          : "bg-gray-200"
                      }`}
                      style={{ width: `${p.completionPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-[(family-name:var(--font-yeseva))] text-lg text-gray-900 mb-5">
            Recent Submissions
          </h2>

          {student.submissions.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">
              No submissions yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {student.submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {submission.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {submission.module?.name || "No module"}
                        {submission.type && ` • ${submission.type.toUpperCase()}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                        submission.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : submission.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : submission.status === "under_review"
                          ? "bg-blue-50 text-brand"
                          : submission.status === "submitted"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {submission.status.replace("_", " ")}
                    </span>
                  </div>

                  {submission.submittedAt && (
                    <p className="text-xs text-gray-500 mb-2">
                      Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  )}

                  {submission.feedback && (
                    <div className="mt-2 p-3 bg-white rounded border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 font-medium">
                        Feedback:
                      </p>
                      <p className="text-sm text-gray-700">
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  {submission.score !== null && (
                    <p className="text-xs text-gray-600 mt-2">
                      Score: <span className="font-bold">{submission.score}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
