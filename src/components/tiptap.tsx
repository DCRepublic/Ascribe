"use client";

import "@/styles/tiptap.css";

import { EditorContent, useEditor } from "@tiptap/react";
import React, { useState } from "react";
import { updateDoc } from "@/app/actions/actions";
import { useDebouncedCallback } from "use-debounce";
// This allows font family to work

import MenuBar from "@/components/MenuBar.js";
import { HocuspocusProvider, TiptapCollabProvider } from "@hocuspocus/provider";
import { CircularProgress } from "@heroui/react";

import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import TextAlign from "@tiptap/extension-text-align";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import "@tiptap/core";
import { HocuspocusProviderWebsocket } from "@hocuspocus/provider";

import FontFamily from "@tiptap/extension-font-family"; //fonts are not working -----------------------Commented out - J

const editorProps = {
  attributes: {
    class:
      "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-[85vh] py-5  overflow-y-scroll",
  },
};

export default (props: any) => {
  const [loading, setLoading] = useState(true);

  const socket = new HocuspocusProviderWebsocket({
    url: "wss://ascribe.sccs.swarthmore.edu/server", // or `url` if using `HocuspocusProviderWebsocket`
  });

  const provider = new HocuspocusProvider({
    //url: "wss://ascribe.sccs.swarthmore.edu/server",
    websocketProvider: socket,
    // url: "ws://localhost:5557", //local
    name: `${props.id}`,
    token: "",
  });

  const editor = useEditor({
    onCreate: ({ editor: currentEditor }) => {
      provider.on("synced", () => {
        setLoading(false);
      });
    },

    extensions: [
      FontFamily,
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      Underline,
      //FontFamily, ------------------------------------------------------------ Commented Out - J
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      CharacterCount.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      //TextStyle.configure({ types: [ListItem.name] }),
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
    ],
    editorProps: editorProps,
    injectCSS: true,
    immediatelyRender: false,
  });

  return (
    <>
      {loading ? (
        <CircularProgress className="justify-self-center" />
      ) : (
        <>
          <MenuBar name={props.name} editor={editor} />
          <EditorContent
            className={"dark:bg-neutral-900 bg-slate-50 rounded-md mt-5]"}
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
