"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartIcon } from "./icons";

export function LikeButton({ id, likes }: { id: number; likes: number }) {
  const router = useRouter();
  const [count, setCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  async function like() {
    if (liked || pending) return;
    setPending(true);
    setCount((current) => current + 1);
    setLiked(true);
    try {
      const response = await fetch(`/api/engagements/${id}/like`, { method: "POST" });
      const data = (await response.json()) as { ok?: boolean; likes?: number };
      if (data.ok && typeof data.likes === "number") setCount(data.likes);
      router.refresh();
    } catch {
      setCount((current) => Math.max(current - 1, 0));
      setLiked(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={like}
      disabled={liked || pending}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition ${
        liked
          ? "border-clay/40 bg-clay-soft text-clay"
          : "border-line bg-white text-ink/65 hover:border-clay/40 hover:text-clay"
      }`}
      aria-label="Appreciate this engagement"
    >
      <HeartIcon className="h-4 w-4" />
      {count}
      <span className="hidden sm:inline">appreciations</span>
    </button>
  );
}

export function CommentForm({ id }: { id: number }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/engagements/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, body }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Could not post that comment.");
      setBody("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          required
          placeholder="Your name"
          className="field sm:w-40"
        />
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          placeholder="Add a reply or ask a question…"
          className="field flex-1"
        />
        <button type="submit" disabled={pending} className="btn-outline !py-2.5 text-[12px]">
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
      {error ? <p className="text-[12px] font-medium text-clay">{error}</p> : null}
    </form>
  );
}
