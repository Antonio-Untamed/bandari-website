"use client";

import { useState } from "react";

export function VehicleGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string;
}) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[active]} alt={alt} className="h-full w-full object-cover" />
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">
            {badge}
          </span>
        ) : null}
        <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur">
          {active + 1} / {gallery.length}
        </span>
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1}`}
              className={`aspect-[4/3] overflow-hidden rounded-xl border transition ${
                active === index ? "border-moss ring-2 ring-moss/25" : "border-line opacity-80 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
