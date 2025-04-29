import React from "react";
import { genJWT, getDocByID } from "@/app/actions/actions";
import Tiptap from "@/components/tiptap";
import TipTapShared from "@/components/TipTapShared";
import { auth } from "@/app/auth";

export default async function IndexPage({
  params,
}: {
  params: Promise<{ docid: string }>;
}) {
  const slug = await params;

  const document = await getDocByID(parseInt(slug.docid));
  const jwt = await genJWT();
  const session = await auth();

  return (
    <>
      <div className="w-full ">
        {document != null ? (
          document?.shared_access.length > 0 ? (
            <TipTapShared
              id={document.id}
              name={document?.name}
              session={session}
              jwt={jwt}
            ></TipTapShared>
          ) : (
            <Tiptap id={document.id} name={document?.name} session={session} />
          )
        ) : null}
      </div>
    </>
  );
}
