import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string; cohort?: string }>;
}

export default async function StudentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";
  const cohortFilter = params.cohort || "";

  // Fetch all delegates with their cohorts, submissions, and progress
  const students = await prisma.user.findMany({
    where: {
      role: "delegate",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(cohortFilter ? { cohortId: cohortFilter } : {}),
    },
    include: {
      cohort: { select: { name: true, id: true } },
      submissions: { select: { status: true, id: true } },
      progress: { select: { completionPercentage: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const cohorts = await prisma.cohort.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[(family-name:var(--font-yeseva))] text-3xl text-gray-900">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            {students.length} delegate{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
      </div>

      {/* Filters */}
      <form className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        <select
          name="cohort"
          defaultValue={cohortFilter}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
        >
          <option value="">All cohorts</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || "Unnamed"}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-light transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Student Table */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p className="text-gray-900 font-semibold">No students found</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Student
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Cohort
                  </th>
                  <th className="text-center px-6 py-3 text-gray-600 font-medium">
                    Submissions
                  </th>
                  <th className="text-center px-6 py-3 text-gray-600 font-medium">
                    Pending
                  </th>
                  <th className="text-center px-6 py-3 text-gray-600 font-medium">
                    Avg Progress
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const pendingCount = student.submissions.filter(
                    (s) => s.status === "submitted" || s.status === "under_review"
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
                    <tr
                      key={student.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="group"
                        >
                          <p className="font-semibold text-gray-900 group-hover:text-brand transition-colors">
                            {student.name || "Unnamed"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {student.email}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {student.cohort?.name || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">
                          {student.submissions.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {pendingCount > 0 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                            {pendingCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-brand h-1.5 rounded-full"
                              style={{ width: `${avgProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 w-8">
                            {avgProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
