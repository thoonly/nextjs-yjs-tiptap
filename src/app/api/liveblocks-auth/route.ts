import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Generate a cartoon avatar URL using DiceBear API with custom background color
function getCartoonAvatar(seed: string, color: string): string {
  // Remove the # from hex color for the URL parameter
  const backgroundColor = color.replace("#", "");
  return `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user } = body;

  // Generate a unique user ID based on name and timestamp for session uniqueness
  const userId = `user-${user.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  // Generate cartoon avatar with user's color as background
  const avatar = getCartoonAvatar(user.name, user.color);

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: user.name,
      color: user.color,
      picture: avatar,
    },
  });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { body: authBody, status } = await session.authorize();
  return new Response(authBody, { status });
}
