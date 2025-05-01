"use client";

import { SocketContext } from "@/components/providers/SocketContext";
import CollaborativeEditor from "@/components/TipTapShared";
import { HocuspocusProvider } from "@hocuspocus/provider";
// import { TiptapCollabProvider } from "@tiptap-cloud/provider";
import { useContext, useEffect, useState } from "react";
import CollaborationStatus from "@/components/CollaborationStatus";
import { getDocByID } from "@/app/actions/actions";
import { Session } from "next-auth";

export default function ({
  slug,
  session,
}: {
  slug: string;
  session: Session | null;
}) {
  const socket = useContext(SocketContext);
  const [docName, setDocName] = useState<any>("");
  const [provider, setProvider] = useState<HocuspocusProvider>();

  async function getName() {
    let document = await getDocByID(parseInt(slug));
    setDocName(document?.name);
  }

  useEffect(() => {
    if (!socket) return;

    getName();
    // const _p = new TiptapCollabProvider({
    const _p = new HocuspocusProvider({
      websocketProvider: socket,
      name: slug,
      onOpen: (data) => console.log("onOpen!", data),
      onClose: (data) => console.log("onClose!", data),
      onAuthenticated: (data) => console.log("onAuthenticated!", data),
      onAuthenticationFailed: (data) =>
        console.log("onAuthenticationFailed", data),
      onUnsyncedChanges: (data) => console.log("onUnsyncedChanges", data),
    });

    setProvider(_p);

    return () => {
      _p.detach();
    };
  }, [socket, slug]);

  if (!provider) {
    return <></>;
  }

  // you need to attach here, to make sure the connection gets properly established due to React strict-mode re-run of hooks
  provider.attach();

  return (
    <div>
      <h1 className="ml-5">
        <strong>Document </strong>
        {docName}
      </h1>

      <CollaborationStatus provider={provider} />

      <CollaborativeEditor slug={slug} provider={provider} session={session} />
    </div>
  );
}
