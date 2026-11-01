import Link from "next/link";
import type { Metadata } from "next";
import { EngagementComposer } from "@/components/engagement-composer";
import { CommentForm, LikeButton } from "@/components/engagement-actions";
import { Stars } from "@/components/ui";
import { HeartIcon, PinIcon, ShipIcon } from "@/components/icons";
import { getAllVehicles, getEngagements } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client engagements",
  description:
    "Real stories from Kenyan importers — inspection, shipping, clearing and handover, with replies from the Bandari desk.",
};

export default async function EngagementsPage() {
  const [posts, vehicles] = await Promise.all([getEngagements(), getAllVehicles()]);
  const average =
    posts.length > 0
      ? (posts.reduce((sum, post) => sum + post.rating, 0) / posts.length).toFixed(1)
      : "5.0";
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <>
      <section className="bg-forest py-14 text-cream sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow !text-cream/55">
                <HeartIcon className="h-4 w-4" />
                Engagement wall
              </span>
              <h1 className="display mt-4 text-[38px] text-cream sm:text-[50px]">
                Clients, in their own words
              </h1>
              <p className="mt-4 text-[14.5px] leading-relaxed text-cream/70">
                Reviews are tied to real import files. Ask a follow-up, compare notes with another
                buyer, or add your own story after handover.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-5 text-center">
              {[
                { value: average, label: "avg rating" },
                { value: `${totalLikes}`, label: "appreciations" },
                { value: `${totalComments}`, label: "replies" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="display text-[28px] text-cream">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-cream/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="#share" className="btn-clay !py-2.5 text-[13px]">
              Share your engagement
            </Link>
            <Link
              href="/vehicles"
              className="btn border border-cream/25 !py-2.5 text-[13px] text-cream hover:bg-cream/10"
            >
              Browse live inventory
            </Link>
            <span className="inline-flex items-center gap-2 text-[11.5px] text-cream/45">
              <ShipIcon className="h-4 w-4" />
              {posts.length} published stories
            </span>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-5">
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-[14px] font-semibold text-forest">
                    {post.authorName
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part.charAt(0))
                      .join("")}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-forest">
                      {post.authorName}
                      {post.pinned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/55">
                          <PinIcon className="h-2.5 w-2.5" /> featured
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11.5px] text-ink/50">
                      {post.city} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <Stars rating={post.rating} />
              </div>

              <div className="px-5 pt-4">
                <h2 className="text-[16px] font-semibold leading-snug text-forest">{post.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">{post.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.vehicleName ? <span className="chip">{post.vehicleName}</span> : null}
                  {post.trackingCode ? (
                    <Link
                      href={`/track/${post.trackingCode}`}
                      className="chip font-mono !text-[10px] hover:border-moss"
                    >
                      {post.trackingCode}
                    </Link>
                  ) : null}
                </div>
              </div>

              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={`${post.authorName}'s imported vehicle`}
                  className="mt-4 h-56 w-full object-cover sm:h-72"
                  loading="lazy"
                />
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
                <LikeButton id={post.id} likes={post.likes} />
                <details className="group w-full sm:w-auto">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-2 py-1.5 text-[12px] font-semibold text-ink/60 transition hover:text-forest [&::-webkit-details-marker]:hidden">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M3 5.5h14v8H9l-4 3v-3H3v-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                    {post.comments.length} {post.comments.length === 1 ? "reply" : "replies"}
                  </summary>
                  <div className="mt-3 w-full">
                    {post.comments.length > 0 ? (
                      <ul className="space-y-2.5">
                        {post.comments.map((comment) => (
                          <li key={comment.id} className="rounded-xl bg-sand/50 px-3.5 py-2.5">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="text-[12px] font-semibold text-forest">{comment.authorName}</p>
                              <p className="text-[10.5px] text-ink/40">{formatDate(comment.createdAt)}</p>
                            </div>
                            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink/65">{comment.body}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[12px] text-ink/45">No replies yet — be the first to ask a question.</p>
                    )}
                    <CommentForm id={post.id} />
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:sticky lg:top-24">
          <EngagementComposer vehicles={vehicles.map((vehicle) => `${vehicle.make} ${vehicle.model}`)} />
          <div className="card mt-4 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              House rules
            </p>
            <ul className="mt-2.5 space-y-1.5 text-[12px] leading-relaxed text-ink/55">
              <li>· Only share files you actually imported.</li>
              <li>· Keep it useful for the next buyer.</li>
              <li>· Our desk replies within one working day.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
