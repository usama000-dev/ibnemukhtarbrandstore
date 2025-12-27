'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code as CodeIcon,
  Undo,
  Redo,
  Minus,
  Eraser,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // ✅ enables headings
        },
      }),
      Underline,
      Strike,
      Code,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle, // ✅ required for color
      Color,     // ✅ enables text color
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });


  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {/* Text styles */}
        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}>
          <Bold className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}>
          <Italic className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-gray-200' : ''}>
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}>
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-gray-200' : ''}>
          <CodeIcon className="h-4 w-4" />
        </Button>

        {/* Headings */}
        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}>
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}>
          <Heading2 className="h-4 w-4" />
        </Button>


        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className='mt-1'
        />
        {/* Lists, quotes, rules */}
        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}>
          <List className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}>
          <Quote className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </Button>

        {/* Link */}
        <Button type="button" variant="ghost" size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Clear formatting */}
        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser className="h-4 w-4" />
        </Button>

        {/* Undo/Redo */}
        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="prose [&_a]:text-blue-600 [&_a]:underline [&_u]:underline [&_u]:decoration-yellow-500 max-w-none p-4 min-h-[200px] prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg"
      />

    </div>
  );
}
