"use client";

import { useState, useEffect } from "react";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { UserNameDialog } from "@/components/UserNameDialog";
import { RoomDialog } from "@/components/RoomDialog";
import { Navbar } from "@/components/Navbar";
import styles from "./page.module.css";

const USER_STORAGE_KEY = "liveblocks-user";
const ROOM_STORAGE_KEY = "liveblocks-room";

type UserData = {
  name: string;
  color: string;
};

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user and room
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedRoom = localStorage.getItem(ROOM_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    if (storedRoom) {
      setRoomId(storedRoom);
    }
    setIsLoading(false);
  }, []);

  const handleUserSubmit = (name: string, color: string) => {
    const userData = { name, color };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const handleRoomSubmit = (newRoomId: string) => {
    localStorage.setItem(ROOM_STORAGE_KEY, newRoomId);
    setRoomId(newRoomId);
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem(ROOM_STORAGE_KEY);
    setRoomId(null);
  };

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <UserNameDialog onSubmit={handleUserSubmit} />;
  }

  if (!roomId) {
    return <RoomDialog onSubmit={handleRoomSubmit} />;
  }

  return (
    <main className={styles.main}>
      <Room user={user} roomId={roomId}>
        <div className={styles.container}>
          <Navbar roomId={roomId} onLeaveRoom={handleLeaveRoom} />
          <div className={styles.columns}>
            <div className={styles.column}>
              <CollaborativeEditor field="input" />
            </div>
            <div className={styles.column}>
              <CollaborativeEditor field="output" />
            </div>
          </div>
        </div>
      </Room>
    </main>
  );
}
