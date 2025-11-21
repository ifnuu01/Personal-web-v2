import type { PartialBlock, BlockNoteEditor } from "@blocknote/core";

export async function customMarkdownToBlocks(
    markdown: string,
    editor: BlockNoteEditor
): Promise<PartialBlock[]> {
    const codeFenceRegex = /```(\w*)\n([\s\S]*?)```/g;

    const blocks: PartialBlock[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeFenceRegex.exec(markdown)) !== null) {
        const lang = match[1] || "";
        const code = match[2];
        const matchStart = match.index;
        const matchFull = match[0];
        const textBefore = markdown.slice(lastIndex, matchStart).trim();
        if (textBefore) {
            const parsedBefore = await editor.tryParseMarkdownToBlocks(textBefore);
            blocks.push(...parsedBefore);
        }
        blocks.push({
            type: "codeBlock",
            props: { language: lang },
            content: [{ type: "text", text: code.trim(), styles: {} }]
        });

        lastIndex = matchStart + matchFull.length;
    }

    const remaining = markdown.slice(lastIndex).trim();
    if (remaining) {
        const parsedRemaining = await editor.tryParseMarkdownToBlocks(remaining);
        blocks.push(...parsedRemaining);
    }

    return blocks;
}

export function fixCodeBlocksInMarkdown(markdown: string): string {
    return markdown.replace(/```(\w*)\s*(.*?)```/gs, (lang, code) => {
        const trimmed = code.trim();
        return `\`\`\`${lang || ""}\n${trimmed}\n\`\`\``;
    });
}
