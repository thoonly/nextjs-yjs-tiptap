"use client";

import { ReactNode, useCallback } from "react";
import { RoomProvider } from "@liveblocks/react/suspense";
import { LiveblocksProvider } from "@liveblocks/react";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loading } from "@/components/Loading";

type UserData = {
  name: string;
  color: string;
};

type RoomProps = {
  children: ReactNode;
  user: UserData;
  roomId: string;
};

export function Room({ children, user, roomId }: RoomProps) {
  const authEndpoint = useCallback(async () => {
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
    return await response.json();
  }, [user]);

  return (
    <LiveblocksProvider authEndpoint={authEndpoint}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
