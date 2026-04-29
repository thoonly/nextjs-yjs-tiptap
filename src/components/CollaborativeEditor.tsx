"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { Toolbar } from "./Toolbar";
import styles from "./CollaborativeEditor.module.css";

type CollaborativeEditorProps = {
  field?: string;
};

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor({ field = "content" }: CollaborativeEditorProps) {
  const room = useRoom();
  // Set up Liveblocks Yjs provider
  const provider = getYjsProviderForRoom(room);

  if (!provider) {
    return null;
  }

  const doc = provider.getYDoc();

  return <TiptapEditor doc={doc} provider={provider} field={field} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  field: string;
};

function TiptapEditor({ doc, provider, field }: EditorProps) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);

  // Set up editor with plugins, and place user info into Yjs awareness and cursors
  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    autofocus: true,
    editorProps: {
      attributes: {
        // Add styles to editor element
        class: styles.editor,
      },
    },
    extensions: [
      StarterKit.configure({
        // The Collaboration extension comes with its own history handling  
        undoRedo: false,
      }),
      // Register the document with Tiptap using custom Yjs fragment name
      Collaboration.configure({
        document: doc,
        // Store content in a custom named fragment in the Yjs document
        field: field,
      }),
      // Attach provider and user info for collaborative cursors
      CollaborationCaret.configure({
        provider: provider,
        user: userInfo,
      }),
    ],
  });

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <Toolbar editor={editor} />
      </div>
      <div className={styles.editorContainer}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
