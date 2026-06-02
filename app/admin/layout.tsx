import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/auth/login");

  const role = (session.user as any).role;
  if (role !== "admin" && role !== "instructor") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Nav */}
      <header className="sticky top-0 z-40 bg-gray-400 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/tid-logo.svg"
                  alt="The Implant Diploma"
                  width={140}
                  height={28}
                  className="h-7 w-auto"
                />
              </Link>
              <span className="text-xs px-2 py-0.5 bg-brand text-white rounded font-semibold uppercase tracking-wider">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-sm text-gray-700 hover:text-brand transition-colors font-medium"
              >
                Overview
              </Link>
              <Link
                href="/admin/students"
                className="text-sm text-gray-700 hover:text-brand transition-colors font-medium"
              >
                Students
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 hover:text-brand transition-colors font-medium"
              >
                Delegate View
              </Link>
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

      <main className="flex-1">{children}</main>
    </div>
  );
}
