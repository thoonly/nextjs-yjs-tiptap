"use client";

import { useState } from "react";
import styles from "./RoomDialog.module.css";

type RoomDialogProps = {
  onSubmit: (roomId: string) => void;
};

export function RoomDialog({ onSubmit }: RoomDialogProps) {
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onSubmit(roomId.trim());
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>Join Room</h2>
        <p className={styles.subtitle}>
          Enter a room ID to join. If the room doesn&apos;t exist, it will be created automatically.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!roomId.trim()}
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
