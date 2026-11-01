import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { isAdmin } from "@/lib/admin-auth";
import { adminStats, getAdminOrders, getAdminVehicles, getInquiries } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Import desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [vehicles, orders, inquiries] = await Promise.all([
    getAdminVehicles(),
    getAdminOrders(),
    getInquiries(),
  ]);

  return (
    <div className="container-page py-8 sm:py-10">
      <AdminDashboard
        vehicles={vehicles}
        orders={orders}
        inquiries={inquiries.map((inquiry) => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          budget: inquiry.budget,
          message: inquiry.message,
          createdAt: inquiry.createdAt,
        }))}
        stats={adminStats({ vehicles, orders, inquiries })}
      />
    </div>
  );
}
