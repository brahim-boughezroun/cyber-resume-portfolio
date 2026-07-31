import { NextResponse } from "next/server";
import { getPublishedPosts } from "../../../../../database/repositories/post.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getPublishedPosts();

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Published posts query failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not load published posts.",
      },
      {
        status: 500,
      },
    );
  }
}