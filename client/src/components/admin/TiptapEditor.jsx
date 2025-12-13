import React, { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import EditorLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faLink,
  faListDots,
  faListNumeric,
  faQuoteLeft,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";

BulletList.configure({
  keepMarks: true,
});
OrderedList.configure({
  keepMarks: true,
  itemTypeName: "listItem",
});

const TiptapEditor = ({ content, setHtmlContent = () => null }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Underline,
      EditorLink,
    ],
    content: "",
  });

  useEffect(() => {
    console.log(content);
    editor?.commands.setContent(content);
  }, [content, editor]);

  useEffect(() => {
    editor?.on("update", () => {
      setHtmlContent(editor.getHTML());
    });
  }, [editor]);

  return (
    <>
      <EditorContent editor={editor} className="blog__description__input" />
      <div className="blog__format__tools">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FontAwesomeIcon icon={faListDots} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FontAwesomeIcon icon={faListNumeric} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleLink().run()}
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          H5
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          p
        </button>
      </div>
    </>
  );
};

export default TiptapEditor;
