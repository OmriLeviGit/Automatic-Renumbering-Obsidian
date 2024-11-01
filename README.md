# Automatic Renumbering Plugin for Obsidian

The Automatic Renumbering Plugin for Obsidian updates numbered lists automatically to keep them in sequential order, including nested lists. It features live updates, smart pasting, and manual control options for easy editing.

## Installation

1. Download the latest release files.
2. Create a folder for the files and place that folder in the plugin directory. You can find this by opening Obsidian and navigating to **Options → Community plugins**, where you'll see the folder icon and the refresh button next to **Installed plugins**.
3. Click the refresh button next to **Installed plugins**.
4. Enable the plugin.
5. In the plugin settings, set the tab size to match the editor’s tab indent size, which you can find under **Options → Editor → Tab indent size**.

## Features

-   **Live Update**:
    Automatically renumbers lists in real time as edits are made, maintaining accurate keeping sequencing.

-   **Pasting**:
    Maintains correct sequencing when pasting numbered content. When live update is enabled, an optional smart pasting feature can be activated to keep the sequencing consistent with the original numbered list.

-   **Special Key Handling**:
    Temporarily disables the live update when special keys (`Ctrl`, `Command` on Mac, or `Alt/Option`) are pressed during editing, enabling actions such as undo without triggering unnecessary renumbering.

-   **Live Update Disabled**:
    The live update feature can be disabled. Renumbering can be manually triggered through the available commands.

<br>
<br>

![Regular paste](resources/regular_paste.gif)
![Smart paste](resources/smart_paste.gif)

> Regular paste (left) | Smart paste (right).

### Commands (Ctrl + P)

-   **Renumber at cursor position**: Renumbers the list at the position of the cursor.
-   **Renumber all selected numbered lists**: Renumbers all lists within your selected text.
-   **Renumber all numbered lists in note**: Renumbers every numbered list in the active note.

## Performance

The live update feature renumbers lists _locally_, adjusting the current line based on the previous line until it reaches the first correctly numbered line. This approach minimizes unnecessary calculations.
In addition, the plugin was tested with documents containing lists with over 10,000 lines, and no performance issues were found on my machine.

## Limitations

-   **Vim Mode**: It is important to note that the plugin does not support automatic renumbering in Vim mode. However, renumbering commands can still be triggered while using Vim.

-   **Tab indent Size**: For proper sequencing, the size of the indent must be specified manually. This is required in order to ensure correct nested numbering.
