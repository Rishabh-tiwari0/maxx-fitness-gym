import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session";
import LoginView from "./login-view";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginView />;
}
