import * as Y from "yjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { roomId, text, field = "content" } = await request.json();

  if (!roomId || !text) {
    return NextResponse.json(
      { error: "roomId and text are required" },
      { status: 400 }
    );
  }

  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  const baseUrl = "https://api.liveblocks.io/v2";

  // 1. Fetch current state as binary
  const res = await fetch(`${baseUrl}/rooms/${roomId}/ydoc-binary`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Failed to fetch ydoc: ${res.statusText}` },
      { status: res.status }
    );
  }

  // 2. Reconstruct the doc
  const yDoc = new Y.Doc();
  Y.applyUpdate(yDoc, new Uint8Array(await res.arrayBuffer()));

  // 3. Apply changes
  yDoc.getText(field).insert(0, text);

  // 4. Send update back
  const updateRes = await fetch(`${baseUrl}/rooms/${roomId}/ydoc`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/octet-stream",
    },
    body: Y.encodeStateAsUpdate(yDoc),
  });

  if (!updateRes.ok) {
    return NextResponse.json(
      { error: `Failed to update ydoc: ${updateRes.statusText}` },
      { status: updateRes.status }
    );
  }

  return NextResponse.json({ success: true });
}
