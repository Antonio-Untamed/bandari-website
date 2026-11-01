import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Admin sign-in required." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Choose an image to upload." }, { status: 400 });
    }
    const extension = ALLOWED.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { ok: false, error: "Use a JPG, PNG or WebP image." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "That image is larger than 6MB — please compress it first." },
        { status: 400 },
      );
    }

    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(directory, filename), buffer);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("upload failed", error);
    return NextResponse.json({ ok: false, error: "Upload failed. Try an image URL instead." }, { status: 500 });
  }
}
