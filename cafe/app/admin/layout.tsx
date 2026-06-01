import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-6">
        <h1 className="text-2xl font-bold">
          Cafe Admin
        </h1>

        <nav className="mt-8 flex flex-col gap-4">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/orders">Orders</a>
          <a href="/admin/menu">Menu</a>
          <a href="/admin/categories">Categories</a>
          <a href="/admin/tables">Tables</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}