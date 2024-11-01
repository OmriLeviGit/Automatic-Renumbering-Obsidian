import { Editor } from "obsidian";
import { pluginInstance } from "main";
import { getLineInfo, getLastListIndex } from "./utils";

interface PastingRange {
    baseIndex: number;
    offset: number;
}

interface TextModification {
    modifiedText: string | undefined;
    numOfLines: number;
}

// ensures numbered lists in pasted text are numbered correctly
function handlePaste(editor: Editor, textFromClipboard: string): PastingRange {
    const { anchor, head } = editor.listSelections()[0];
    const baseIndex = Math.min(anchor.line, head.line);

    let numOfLines: number;

    const smartPaste = pluginInstance.getSettings().smartPaste;
    if (smartPaste) {
        const afterPasteIndex = Math.max(anchor.line, head.line) + 1;
        const line = editor.getLine(afterPasteIndex);
        const info = getLineInfo(line);

        if (info.number !== undefined) {
            const retval = modifyText(textFromClipboard, info.number);
            textFromClipboard = retval.modifiedText ?? textFromClipboard;
            numOfLines = retval.numOfLines;
        } else {
            numOfLines = countNewlines(textFromClipboard);
        }
    } else {
        numOfLines = countNewlines(textFromClipboard);
    }

    // console.debug("base: ", baseIndex, "last:", lastIndex);
    editor.replaceSelection(textFromClipboard); // paste

    return { baseIndex, offset: numOfLines };
}

function countNewlines(text: string) {
    let count = 0;
    for (const char of text) {
        if (char === "\n") {
            count++;
        }
    }
    return count;
}

// changes the first item of the last numbered list in text to newNumber
function modifyText(text: string, newNumber: number): TextModification {
    const lines = text.split("\n");
    const lineIndex = getLastListIndex(lines);

    if (lineIndex === undefined) {
        return { modifiedText: undefined, numOfLines: lines.length };
    }

    const targetLine = lines[lineIndex];
    const info = getLineInfo(targetLine);

    const newLine = targetLine.slice(0, info.numOfSpaceChars) + newNumber + ". " + targetLine.slice(info.textIndex);

    lines[lineIndex] = newLine;
    const modifiedText = lines.join("\n");

    // console.debug("modifiedText:", modifiedText);

    return { modifiedText, numOfLines: lines.length };
}

export { handlePaste, modifyText, countNewlines };
