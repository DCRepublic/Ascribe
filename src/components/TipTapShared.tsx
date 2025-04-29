"use client";
import "@/styles/tiptap.css";
import { useEditor, EditorContent } from "@tiptap/react";
import React, { useState } from "react";
import { CircularProgress } from "@heroui/react";
import { HocuspocusProvider, TiptapCollabProvider } from "@hocuspocus/provider";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import TextAlign from "@tiptap/extension-text-align";

import "@tiptap/core";

import FontFamily from "@tiptap/extension-font-family"; //fonts are not working -----------------------Commented out - J

// This allows font family to work
import "@tiptap/core";
import MenuBar from "@/components/MenuBar.js";

const editorProps = {
  attributes: {
    class:
      "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-[65vh]  overflow-y-scroll",
  },
};

export default (props: any) => {
  const [loading, setLoading] = useState(true);

  const provider = new HocuspocusProvider({
    url: "wss://ascribe.sccs.swarthmore.edu/server",
    // url:"ws://localhost:5557//local
    name: `${props.id}`,
  });
  /*
  let provider = new WebrtcProvider("example-document", doc);

  let provider = new TiptapCollabProvider({
    name: `${props.name + "-" + props.id}`, // Unique document identifier for syncing. This is your document name.
    appId: process.env.NEXT_PUBLIC_APPID || "", // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: props.jwt,
    document: doc,
    preserveConnection: false,
    user: `${props.session?.user?.name}`,
    broadcast: true,
    // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
    onSynced(editor: any) {
      //console.log(props.content);
    },
  });
*/
  const editor = useEditor({
    //enableContentCheck: true,
    // onContentError: ({ disableCollaboration }) => {
    //  disableCollaboration();
    //},

    onCreate: ({ editor: currentEditor }) => {
      provider.on("synced", () => {
        setLoading(false);
      });
    },
    extensions: [
      FontFamily,
      Underline,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        history: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      CharacterCount,
      Collaboration.extend().configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: `${props.session.user.name}`,
          color: "#77BA99",
        },
      }),
    ],
    editorProps: editorProps,
    injectCSS: true,
    immediatelyRender: false,
  });

  return (
    <>
      {loading ? (
        <CircularProgress
          className="justify-self-center"
          label="Fetching Shared Document.... Connecting"
        />
      ) : (
        <>
          <MenuBar name={props.name} editor={editor} />

          <EditorContent
            className={"dark:bg-neutral-900 bg-slate-50 rounded-md mt-5 "}
            editor={editor}
          />
          <div className="absolute bottom-5 right-14">
            {editor?.storage.characterCount.words()}
          </div>
        </>
      )}
    </>
  );
};
