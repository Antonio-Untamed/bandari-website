import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/login-form";
import { adminPasscodeHint, isAdmin } from "@/lib/admin-auth";
import { SITE } from "@/lib/site";
import { ShieldIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Import desk sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <span className="eyebrow">
          <ShieldIcon className="h-4 w-4" />
          Staff only
        </span>
        <h1 className="display mt-3 text-[34px] text-forest">Import desk</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">
          Sign in to upload units, update shipment stages and read callback requests. Client-facing
          pages are unaffected.
        </p>
        <AdminLoginForm hint={adminPasscodeHint()} />
        <p className="mt-4 text-center text-[11.5px] text-ink/45">
          Need access? Call the desk on {SITE.phoneDisplay}.
        </p>
      </div>
    </div>
  );
}
