import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Footer } from "@/components/Footer";
import { getSessionUser } from "@/lib/session";

// This route group covers everything under /admin EXCEPT /admin/login
// (which lives outside the group in app/admin/login, sharing only the
// bare app/admin/layout.js). The check runs server-side on every
// navigation/refresh, so it can't be bypassed the way a client-only
// localStorage check could.
export default async function ProtectedAdminLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
