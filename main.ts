import { Plugin, Editor, EditorPosition, MarkdownView, MarkdownFileInfo, EditorChange } from "obsidian";
import { Mutex } from "async-mutex";
import handlePasteAndDrop from "src/pasteAndDropHandler";
import { registerCommands } from "src/command-registration";
import Renumberer from "src/Renumberer";
import PluginSettings from "./src/settings-tab";
import SettingsManager, { DEFAULT_SETTINGS } from "src/SettingsManager";
import { reorderCheckboxes } from "src/checkbox";
import { ReorderData } from "src/types";

const mutex = new Mutex();

export default class AutoReordering extends Plugin {
    private renumberer: Renumberer;
    private settingsManager: SettingsManager;
    private blockChanges = false;
    private checkboxClickedAt: number | undefined = undefined;
    private handleKeystrokeBound: (event: KeyboardEvent) => void;
    private handleMouseBound: (event: MouseEvent) => void;

    async onload() {
        await this.loadSettings();
        registerCommands(this);
        this.addSettingTab(new PluginSettings(this.app, this));
        this.settingsManager = SettingsManager.getInstance();
        this.renumberer = new Renumberer();

        // editor-change listener
        this.registerEvent(
            this.app.workspace.on("editor-change", (editor: Editor) => {
                setTimeout(() => {
                    mutex.runExclusive(() => {
                        const originalPos = editor.getCursor();

                        if (this.blockChanges) {
                            return;
                        }

                        this.blockChanges = true; // Prevents multiple renumbering/checkbox updates. Reset to false on mouse/keyboard input

                        let currIndex: number;
                        if (this.checkboxClickedAt !== undefined) {
                            currIndex = this.checkboxClickedAt;
                            this.checkboxClickedAt = undefined;
                        } else {
                            const { anchor, head } = editor.listSelections()[0];
                            currIndex = Math.min(anchor.line, head.line);
                        }

                        // Handle checkbox updates
                        let reorderData: ReorderData | undefined;
                        if (this.settingsManager.getLiveCheckboxUpdate() === true) {
                            reorderData = reorderCheckboxes(editor, currIndex);
                        }

                        // Handle numbering updates
                        if (this.settingsManager.getLiveNumberingUpdate() === true) {
                            if (reorderData !== undefined) {
                                // if reordered checkbox, renumber between the original location and the new one
                                this.renumberer.renumber(editor, reorderData.start, reorderData.limit);
                            } else {
                                this.renumberer.renumber(editor, currIndex);
                            }
                        }

                        this.updateCursorPosition(editor, originalPos, reorderData);
                    });
                }, 0);
            })
        );

        // editor-paste listener
        this.registerEvent(
            this.app.workspace.on("editor-paste", (evt: ClipboardEvent, editor: Editor) => {
                handlePasteAndDrop.call(this, evt, editor, mutex);
            })
        );

        // editor-drop listener
        this.registerEvent(
            this.app.workspace.on("editor-drop", (evt: DragEvent, editor: Editor) => {
                handlePasteAndDrop.call(this, evt, editor, mutex);
            })
        );

        // keyboard stroke listener
        this.handleKeystrokeBound = this.handleKeystroke.bind(this);
        window.addEventListener("keydown", this.handleKeystrokeBound); // Keystroke listener

        // mouse listener
        this.handleMouseBound = this.handleMouseClick.bind(this);
        window.addEventListener("click", this.handleMouseBound); // mouse listener
    }

    handleKeystroke(event: KeyboardEvent) {
        // if special key, dont renumber automatically
        mutex.runExclusive(() => {
            this.blockChanges = event.ctrlKey || event.metaKey || event.altKey;
        });
    }

    // mouse listener
    handleMouseClick(event: MouseEvent) {
        // if clicked on a checkbox using the mouse (not the same as cursor location)
        mutex.runExclusive(() => {
            this.checkboxClickedAt = undefined;

            const target = event.target as HTMLElement;
            if (target.classList.contains("task-list-item-checkbox")) {
                const listLine = target.closest(".cm-line");
                if (listLine) {
                    const editor = listLine.closest(".cm-editor");
                    if (editor) {
                        const allLines = Array.from(editor.getElementsByClassName("cm-line"));
                        this.checkboxClickedAt = allLines.indexOf(listLine);
                    }
                }
            }

            this.blockChanges = false;
        });
    }

    async onunload() {
        window.removeEventListener("keydown", this.handleKeystrokeBound);
        window.removeEventListener("click", this.handleMouseBound);
    }

    async loadSettings() {
        const settingsManager = SettingsManager.getInstance();
        settingsManager.setSettings(Object.assign({}, DEFAULT_SETTINGS, await this.loadData()));
    }

    async saveSettings() {
        const settingsManager = SettingsManager.getInstance();
        await this.saveData(settingsManager.getSettings());
    }

    /*
    if the current line was reordered and no text was selected:
    if the line unchecked->checked, restore the cursor to the original position
    if the line checked->unchecked, place the cursor at the newly unchecked line
    */
    updateCursorPosition(editor: Editor, originalPos: EditorPosition, reorderData?: ReorderData): void {
        if (editor.somethingSelected() || !reorderData) {
            return;
        }

        let newPosition: EditorPosition;
        if (originalPos.line < reorderData.lastUncheckedIndex) {
            newPosition = {
                line: originalPos.line,
                ch: originalPos.ch,
            };
        } else {
            newPosition = {
                line: reorderData.lastUncheckedIndex,
                ch: editor.getLine(reorderData.lastUncheckedIndex).length,
            };
        }

        editor.setCursor(newPosition);
    }

    getRenumberer(): Renumberer {
        return this.renumberer;
    }
}
