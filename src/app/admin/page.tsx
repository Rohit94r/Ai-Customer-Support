import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { isAdmin } from "@/lib/admin";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  if (!isAdmin(session)) {
    redirect("/dashboard");
  }

  return <AdminDashboard email={session.user?.email || ""} />;
}
