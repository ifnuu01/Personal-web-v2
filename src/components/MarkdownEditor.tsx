import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";
import { customMarkdownToBlocks, fixCodeBlocksInMarkdown } from "../utils/customMarkdownToBlocks";
import { codeBlockOptions } from "@blocknote/code-block";
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";

type PartialBlock = import("@blocknote/core").PartialBlock;

interface MyEditorProps {
    defaultContent?: PartialBlock[];
    initialMarkdown?: string;
    onChange?: (content: PartialBlock[]) => void;
    onMarkdownChange?: (markdown: string) => void;
}

export function MarkdownEditor({ defaultContent, initialMarkdown, onChange, onMarkdownChange }: MyEditorProps) {

    const editor = useCreateBlockNote({
        schema: BlockNoteSchema.create().extend({
            blockSpecs: {
                codeBlock: createCodeBlockSpec(codeBlockOptions),
            }
        }),
        initialContent: defaultContent,
    });

    useEffect(() => {
        if (initialMarkdown && initialMarkdown.trim().length > 0) {
            async function loadMarkdown() {
                try {
                    const blocks = await customMarkdownToBlocks(initialMarkdown!, editor);
                    editor.replaceBlocks(editor.document, blocks);
                } catch (error) {
                    console.error("Error parsing markdown:", error);
                }
            }
            loadMarkdown();
        }
    }, [editor, initialMarkdown]);

    useEditorChange(async (editor) => {
        const blocks = editor.document;
        let markdown = await editor.blocksToMarkdownLossy(blocks);

        markdown = fixCodeBlocksInMarkdown(markdown);

        if (onChange) {
            onChange(blocks as PartialBlock[]);
        }

        if (onMarkdownChange) {
            onMarkdownChange(markdown);
        }
    }, editor);

    return (
        <div className="min-h-[400px] bg-secondary rounded border border-white/10">
            <style>
                {`
                    .bn-editor {
                        background-color: #2d2d2d !important;
                        color: white !important;
                        min-height: 400px;
                    }
                    
                    .bn-editor .ProseMirror {
                        background-color: #2d2d2d !important;
                        color: white !important;
                        padding: 1rem;
                    }
                    
                    .bn-editor .ProseMirror p {
                        color: #2d2d2d !important;
                    }
                    
                    .bn-editor .ProseMirror h1,
                    .bn-editor .ProseMirror h2,
                    .bn-editor .ProseMirror h3,
                    .bn-editor .ProseMirror h4,
                    .bn-editor .ProseMirror h5,
                    .bn-editor .ProseMirror h6 {
                        color: white !important;
                        font-weight: bold;
                    }
                    
                    .bn-editor .ProseMirror pre {
                        background-color: rgba(0, 0, 0, 0.3) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: #e2e8f0 !important;
                    }
                    
                    .bn-editor .ProseMirror code {
                        background-color: rgba(0, 0, 0, 0.2) !important;
                        color: #64b5f6 !important;
                        padding: 0.2rem 0.4rem;
                        border-radius: 0.25rem;
                    }
                    
                    .bn-editor .ProseMirror blockquote {
                        border-left: 4px solid rgba(59, 130, 246, 0.5) !important;
                        background-color: rgba(59, 130, 246, 0.1) !important;
                        color: rgba(255, 255, 255, 0.9) !important;
                    }
                    
                    .bn-editor .ProseMirror ul,
                    .bn-editor .ProseMirror ol {
                        color: rgba(255, 255, 255, 0.9) !important;
                    }
                    
                    .bn-editor [data-node-type="codeBlock"] {
                        background-color: rgba(0, 0, 0, 0.3) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        border-radius: 0.5rem;
                    }
                    
                    .bn-side-menu {
                        background-color: #2d2d2d !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }
                    
                    .bn-suggestion-menu {
                        background-color: #2d2d2d !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        backdrop-filter: blur(8px);
                    }
                    
                    .bn-suggestion-menu-item {
                        color: white !important;
                    }
                    
                    .bn-suggestion-menu-item:hover,
                    .bn-suggestion-menu-item[data-is-selected="true"] {
                        background-color: rgba(59, 130, 246, 0.2) !important;
                    }
                    
                    .mantine-Menu-dropdown {
                        background-color: rgba(30, 41, 59, 0.95) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        backdrop-filter: blur(8px);
                    }
                    
                    .mantine-Menu-item {
                        color: white !important;
                    }
                    
                    .mantine-Menu-item:hover {
                        background-color: rgba(59, 130, 246, 0.2) !important;
                    }
                    
                    .bn-formatting-toolbar {
                        background-color: rgba(30, 41, 59, 0.95) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        backdrop-filter: blur(8px);
                    }
                    
                    .bn-toolbar-button {
                        color: rgba(255, 255, 255, 0.7) !important;
                    }
                    
                    .bn-toolbar-button:hover,
                    .bn-toolbar-button[data-is-selected="true"] {
                        background-color: rgba(59, 130, 246, 0.2) !important;
                        color: white !important;
                    }
                    
                    .bn-editor .ProseMirror::placeholder {
                        color: rgba(255, 255, 255, 0.5) !important;
                    }
                `}
            </style>
            <BlockNoteView
                editor={editor}
                onChange={() => { }}
                theme={"dark"}
            />
        </div>
    );
}