import { Editor, EditorChange } from "obsidian";
import { getListStart, getLineInfo } from "../utils";
import { RenumberingStrategy, PendingChanges } from "../types";
import { generateChanges } from "./renumbering-utils";

// responsible for all renumbering actions
export default class Renumberer {
    private strategy: RenumberingStrategy;

    constructor(strategy: RenumberingStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: RenumberingStrategy) {
        this.strategy = strategy;
    }

    renumber(editor: Editor, currLine: number) {
        const changes = this.strategy.renumber(editor, currLine).changes;
        if (changes.length > 0) {
            this.applyChangesToEditor(editor, changes);
        }
    }

    // renumbers the list at cursor location from start to end
    listAtCursor = (editor: Editor) => {
        const { anchor, head } = editor.listSelections()[0];
        const currLine = Math.min(anchor.line, head.line);
        this.applyChangesToEditor(editor, this.renumberBlock(editor, currLine).changes);
    };

    // renumbers all numbered lists in specified range
    allListsInRange = (editor: Editor, currLine: number, end: number) => {
        const changes: EditorChange[] = [];
        while (currLine <= end) {
            const line = editor.getLine(currLine);
            if (line) {
                const { number } = getLineInfo(line);
                if (number) {
                    const newChanges = this.renumberBlock(editor, currLine);

                    if (newChanges.endIndex !== undefined) {
                        changes.push(...newChanges.changes);
                        currLine = newChanges.endIndex;
                    }
                }
            }

            currLine++;
        }

        this.applyChangesToEditor(editor, changes);
    };

    // updates a numbered list from start to end
    private renumberBlock(editor: Editor, currLine: number): PendingChanges {
        const startIndex = getListStart(editor, currLine);

        if (startIndex === undefined) {
            return { changes: [], endIndex: undefined }; // not a part of a numbered list
        }

        return generateChanges(editor, startIndex);
    }

    private applyChangesToEditor(editor: Editor, changes: EditorChange[]) {
        const changesApplied = changes.length > 0;

        if (changesApplied) {
            editor.transaction({ changes });
        }
        changes.splice(0, changes.length);
        return changesApplied;
    }
}