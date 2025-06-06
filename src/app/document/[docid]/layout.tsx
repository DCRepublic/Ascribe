"use client";

import { SocketContext } from "@/components/providers/SocketContext";
import { HocuspocusProviderWebsocket } from "@hocuspocus/provider";
// import {
// 	TiptapCollabProvider,
// 	TiptapCollabProviderWebsocket,
// } from "@tiptap-cloud/provider";
import { useEffect, useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [socket, setSocket] = useState<HocuspocusProviderWebsocket | null>(
    null
  );

  useEffect(() => {
    const newlyCreatedSocket = new HocuspocusProviderWebsocket({
      //url: "ws://localhost:5557",
      //url: process.env.TIPTAPURL || "",
      url: "wss://ascribe.sccs.swarthmore.edu/server",
    });
    // const newlyCreatedSocket = new TiptapCollabProviderWebsocket({
    // 	appId: "",
    // });

    setSocket(newlyCreatedSocket);

    return () => {
      newlyCreatedSocket?.destroy();
    };
  }, []);

  if (socket) {
    return <SocketContext value={socket}>{children}</SocketContext>;
  }
}
