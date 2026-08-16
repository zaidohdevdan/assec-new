import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
  Eraser,
  Type,
} from "lucide-react";

// ─── Separator ─────────────────────────────────────────────────────────────────

function Sep() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;
}

// ─── Toolbar Button ────────────────────────────────────────────────────────────

function TBtn({
  onClick,
  title,
  active,
  disabled,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${active
        ? "bg-primary text-white shadow-sm"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// ─── Toolbar ───────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
  const insertLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("URL do link:", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  };

  const insertImage = () => {
    const url = prompt("URL da imagem:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt: "" }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
      {/* Undo / Redo */}
      <TBtn
        onClick={() => editor.chain().focus().undo().run()}
        title="Desfazer (Ctrl+Z)"
        disabled={!editor.can().undo()}
      >
        <Undo className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().redo().run()}
        title="Refazer (Ctrl+Y)"
        disabled={!editor.can().redo()}
      >
        <Redo className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Inline formatting */}
      <TBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrito (Ctrl+B)"
        active={editor.isActive("bold")}
      >
        <Bold className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Itálico (Ctrl+I)"
        active={editor.isActive("italic")}
      >
        <Italic className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Sublinhado (Ctrl+U)"
        active={editor.isActive("underline")}
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Código inline"
        active={editor.isActive("code")}
      >
        <Code className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Headings */}
      <TBtn
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Parágrafo"
        active={editor.isActive("paragraph")}
      >
        <Type className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Título H2"
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Subtítulo H3"
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Lists */}
      <TBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista com marcadores"
        active={editor.isActive("bulletList")}
      >
        <List className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
        active={editor.isActive("orderedList")}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Blockquote */}
      <TBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Citação / Destaque"
        active={editor.isActive("blockquote")}
      >
        <Quote className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Text alignment */}
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="Alinhar à esquerda"
        active={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="Centralizar"
        active={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="Alinhar à direita"
        active={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Link + Image */}
      <TBtn
        onClick={insertLink}
        title="Inserir / editar link"
        active={editor.isActive("link")}
      >
        <Link2 className="h-3.5 w-3.5" />
      </TBtn>
      <TBtn onClick={insertImage} title="Inserir imagem (por URL)">
        <ImageIcon className="h-3.5 w-3.5" />
      </TBtn>

      <Sep />

      {/* Remove formatting */}
      <TBtn
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        title="Remover toda a formatação"
      >
        <Eraser className="h-3.5 w-3.5" />
      </TBtn>
    </div>
  );
}

// ─── RichTextEditor ────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  /** Current HTML string value */
  value: string;
  /** Called whenever the content changes */
  onChange: (html: string) => void;
  /** Minimum editor height in px (default: 260) */
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  minHeight = 260,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // heading levels we want
        heading: { levels: [2, 3, 4] },
        // codeBlock is included in StarterKit — keep it
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-accent-dark underline hover:text-accent",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg my-4 mx-auto block",
        },
      }),
      Placeholder.configure({
        placeholder: "Escreva o conteúdo completo do comunicado aqui...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: [
          "tiptap-editor",
          "outline-none",
          "min-h-[inherit]",
          "px-5 py-4",
          "text-sm text-[var(--text-primary)]",
          "leading-relaxed",
          // prose-like typography
          "prose prose-sm max-w-none",
          "prose-headings:font-serif prose-headings:text-[var(--color-primary)]",
          "prose-a:text-[var(--color-accent-dark)] prose-a:underline",
          "prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-accent)] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--text-secondary)]",
          "prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded prose-code:text-[var(--text-primary)]",
          "prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:overflow-x-auto",
          "prose-img:rounded-lg prose-img:max-w-full",
          "prose-li:my-0.5",
        ].join(" "),
      },
    },
    // Sync external value changes (e.g. when editing an existing notice)
    immediatelyRender: false,
  });

  // When value changes externally (e.g. loading an existing notice for edit),
  // sync the editor content — but only if the editor is not focused to avoid
  // cursor jumping mid-type.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (!editor) return;
    if (value === prevValue.current) return;
    prevValue.current = value;
    if (!editor.isFocused) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className="border border-slate-200 rounded-md overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[var(--border-focus)] bg-white"
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className="tiptap-content"
      />
    </div>
  );
}
