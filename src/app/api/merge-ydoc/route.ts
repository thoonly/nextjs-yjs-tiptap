import * as Y from "yjs";
import { updateYFragment } from "y-prosemirror";
import { Markdown, MarkdownManager } from "@tiptap/markdown";
import { getSchema } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { NextRequest, NextResponse } from "next/server";

const extensions = [
  Markdown,
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Heading.configure({ levels: [1, 2, 3] }),
  Blockquote,
  CodeBlock,
  HorizontalRule,
  HardBreak,
  Image,
  Link,
  Code,
  BulletList,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
];

const schema = getSchema(extensions);

export async function POST(request: NextRequest) {
  const { roomId, text, field = "input" } = await request.json();

  if (!roomId || !text) {
    return NextResponse.json(
      { error: "roomId and text are required" },
      { status: 400 }
    );
  }

  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  const baseUrl = "https://api.liveblocks.io/v2";

  const res = await fetch(`${baseUrl}/rooms/${roomId}/ydoc-binary`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Failed to fetch ydoc: ${res.statusText}` },
      { status: res.status }
    );
  }

  const serverState = new Uint8Array(await res.arrayBuffer());
  const serverStateVector = Y.encodeStateVectorFromUpdate(serverState);
  const serverDoc = new Y.Doc();
  Y.applyUpdate(serverDoc, serverState);

  const serverFragment = serverDoc.getXmlFragment(field);

  const title = field === "input" ? "Key Themes" : "General Summary";
  const markdown = `# ${title}\n\n${text}`;

  const markdownManager = new MarkdownManager();
  extensions.forEach((ext) => markdownManager.registerExtension(ext));
  const tiptapJSON = markdownManager.parse(markdown);
  const pmNode = schema.nodeFromJSON(tiptapJSON);

  updateYFragment(serverDoc, serverFragment, pmNode, {
    mapping: new Map(),
    isOMark: new Map(),
  });

  const mergedState = Y.encodeStateAsUpdate(serverDoc, serverStateVector);
  serverDoc.destroy();

  const updateRes = await fetch(`${baseUrl}/rooms/${roomId}/ydoc`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/octet-stream",
    },
    body: mergedState,
  });

  if (!updateRes.ok) {
    return NextResponse.json(
      { error: `Failed to update ydoc: ${updateRes.statusText}` },
      { status: updateRes.status }
    );
  }

  return NextResponse.json({ success: true });
}
