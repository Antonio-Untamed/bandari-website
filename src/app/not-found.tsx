import Link from "next/link";
import { ArrowRight, ShipIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">
          <ShipIcon className="h-4 w-4" />
          404 · off the manifest
        </span>
        <h1 className="display mt-4 text-[40px] text-forest sm:text-[52px]">
          This page has sailed
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
          The vehicle may have been sold, or the link is mistyped. Our live inventory and tracking desk
          are both still open.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/vehicles" className="btn-primary">
            Browse inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/track" className="btn-outline">
            Track a shipment
          </Link>
        </div>
      </div>
    </div>
  );
}
