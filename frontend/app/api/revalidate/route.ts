import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";

// Called from the Studio's Deploy tool, which runs on another origin. The
// bearer secret is the only guard, so a wildcard origin is fine.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Content is too cross-referenced (anatomy ↔ components ↔ connections ↔
// stories) to map a change to the pages that show it, so clear everything.
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  if (
    !secret ||
    given.length !== expected.length ||
    !timingSafeEqual(given, expected)
  ) {
    return Response.json(
      { revalidated: false },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  revalidatePath("/", "layout");
  return Response.json({ revalidated: true }, { headers: CORS_HEADERS });
}
