// Shared shell for everything under /admin. Auth gating now happens in
// app/admin/(protected)/layout.js, server-side, so /admin/login can
// render without ever being subject to the redirect check.
export default function AdminLayout({ children }) {
  return <>{children}</>;
}
