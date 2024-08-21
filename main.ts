import {
	App,
	Editor,
	editorEditorField,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

/*
how it should work:
when typing, check current line. if its of type 'x. ' and the line above it is also 'y. ', make x = y and iterate down until curr line != of type 'x. '
edge cases:
how to deal with 0
what if 1. is not the start of the row
what to do if the line is too long
what to do if this is the first line in the file

understand how indends work in md
first line of file does not start with \n, and so are indends, they have some spacings
handle IO
works with 0, consists with markdown
use editor.transaction(() -> {}) to change history all at once
when looking backwards, save the last prev number found in list, so to avoid updating

add undo button

add tests

for the following list:
2.
3.
5.
give 2 options:

look above. if none, leave as it is.
look above, if not 1, make it 1.
1.
2.
3.
from 2 and onwards: change number to above + 1
2.
3.
4.

**remove all logs, and update manifest:
https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
 
*/
// main logic = cursorHandler
// mainlogicActivity = handleCursorActivity
export default class ExamplePlugin extends Plugin {
	private mainLogic: (editor: Editor) => void;

	onload() {
		console.log("onLoad");
		this.mainLogic = this.mainLogicActivity.bind(this);
		this.registerEvent(
			this.app.workspace.on("editor-change", (editor: Editor) => {
				this.mainLogic(editor);
			})
		);
	}

	// find if line starts with a num
	getNumInList(lineText: string): number {
		let match = lineText.match(/^(\d+)\. /);
		return match == undefined ? -1 : parseInt(match[1]);
	}

	mainLogicActivity(editor: Editor) {
		if (editor == undefined) return;

		const cursor = editor.getCursor();
		const currLineIndex = cursor?.line;

		if (currLineIndex == undefined) return;

		let startIndex;
		// if curr line is not in a numbered list
		if (
			this.getNumInList(editor.getLine(currLineIndex)) < 0 ||
			currLineIndex == 0
		) {
			startIndex = currLineIndex;
		} else {
			let lookbackIndex = currLineIndex - 1;
			while (this.getNumInList(editor.getLine(lookbackIndex)) > 0) {
				lookbackIndex--;
			}
			startIndex = lookbackIndex + 1;
		}

		console.log("start index is: ", startIndex);
		console.log("curr index is: ", currLineIndex);
	}
}

/*
Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export class Test extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
*/
