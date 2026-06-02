import { prisma } from "@/lib/prisma";

// One-time admin promotion endpoint.
// Protected by ADMIN_SETUP_SECRET — set this in Vercel env vars.
// Only works when no admin exists yet (first-admin bootstrap).

const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;

export async function POST(req: Request) {
  if (!SETUP_SECRET) {
    return Response.json(
      { error: "ADMIN_SETUP_SECRET not configured" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token !== SETUP_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === "admin") {
    return Response.json({ message: "User is already admin", user });
  }

  // Promote to admin
  const updated = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  return Response.json({
    message: `User ${email} promoted to admin`,
    user: { id: updated.id, email: updated.email, role: updated.role },
  });
}
