"use client";
import "@/styles/tiptap.css";
import { useEditor, EditorContent } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";
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

import MenuBar from "@/components/MenuBar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const editorProps = {
  attributes: {
    class:
      "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-[78vh] p-5  overflow-y-scroll dark:bg-neutral-900 bg-white",
  },
};

const CollaborativeEditor = (props: {
  slug: string;
  provider: HocuspocusProvider;
  session: Session | null;
}) => {
  const session = useSession();

  let provider = props.provider;
  /**
   * if you want to load initial content to the editor, the safest way to do so is by applying an initial Yjs update.
   * Yjs updates can safely be applied multiple times, while using `setContent` or similar Tiptap commands may result in
   * duplicate content in the Tiptap editor.
   *
   * The easiest way to generate the Yjs update (`initialContent` above) is to do something like
   *
   * ```
   * console.log(Y.encodeStateAsUpdate(provider.props.document).toString())
   * ```
   *
   * after you have filled the editor with the desired content.
   */
  //Y.applyUpdate(props.provider.document, Uint8Array.from(initialContent));

  useEffect(() => {
    if (!provider) return;
    if (provider.configuration.websocketProvider.status === "connecting") {
      console.log("Not connected... Connecting");
      provider.configuration.websocketProvider.connect();
    }
  }, [props.provider]);

  const editor = useEditor(
    {
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
          document: props.provider.document,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: `${props.session?.user?.name}`,
            color: "#77BA99",
          },
        }),
      ],
      editorProps: editorProps,
      injectCSS: true,

      // immediatelyRender needs to be `false` when using SSR
      immediatelyRender: false,
    },
    [props.provider.document]
  );

  return (
    <>
      <MenuBar editor={editor} slug={props.slug} />{" "}
      <EditorContent editor={editor} />{" "}
    </>
  );
};

export default CollaborativeEditor;
