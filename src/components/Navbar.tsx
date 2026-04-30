"use client";

import { useState } from "react";
import { Avatars } from "@/components/Avatars";
import styles from "./Navbar.module.css";

const USER_STORAGE_KEY = "liveblocks-user";
const ROOM_STORAGE_KEY = "liveblocks-room";

type NavbarProps = {
  roomId: string;
  userName: string;
  onLeaveRoom: () => void;
};

export function Navbar({ roomId, userName, onLeaveRoom }: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ROOM_STORAGE_KEY);
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.title}>Collaborative Editor</div>
        <div className={styles.roomInfo}>
          <span className={styles.roomLabel}>Room:</span>
          <code className={styles.roomId}>{roomId}</code>
          <button
            onClick={handleCopyRoomId}
            className={styles.copyButton}
            title="Copy Room ID"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.userName}>{userName}</span>
        <Avatars />
        <button onClick={onLeaveRoom} className={styles.leaveButton}>
          Leave Room
        </button>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}
