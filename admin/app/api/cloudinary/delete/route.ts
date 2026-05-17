import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await req.json();

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
