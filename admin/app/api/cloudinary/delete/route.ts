import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const { publicId } = JSON.parse(text);

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    const result = await deleteImage(publicId);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Cloudinary delete error:", error);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
