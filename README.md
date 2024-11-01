# Automatic Renumbering Plugin for Obsidian

The Automatic Renumbering Plugin for Obsidian updates numbered lists automatically to keep them in sequential order, including nested lists. It features live updates, smart pasting, and manual control options for easy editing.

The Automatic Renumbering plugin for Obsidian helps keep your numbered lists in sequential order automatically, which is particularly useful for users who frequently work with structured documents. It features live updates, smart pasting, and manual control options.

## Installation Steps

To get started with the Automatic Renumbering Plugin, follow these steps:

1. Download the latest release files.
2. Create a folder for the files and place that folder in the **plugins folder**. You can find this by opening Obsidian and navigating to **Options → Community plugins**, where you'll see the folder icon and the **refresh** button next to **Installed plugins**.
3. Click the **refresh** button.
4. Enable the plugin.
5. In the plugin settings, set the tab size to match the editor’s tab indent size, which you can find under **Options → Editor → Tab indent size**.

## Features

-   **Live Update**: Automatically renumbers lists as you edit, helping maintain accurate sequencing without manual adjustments.

-   **Pasting**: Ensures correct sequencing when pasting numbered content. When live update is enabled, an optional smart pasting feature can be enabled to keep the sequencing consistent with the original numbered list.

-   **Special Key Handling**: Temporarily disables the live update when special keys (`Ctrl`, `Command` on Mac, or `Alt/Option`) are pressed during editing, enabling actions such as undo without triggering unnecessary renumbering.

-   **Manual Control**: Offers commands for manual renumbering if you prefer to manage updates yourself.

<br>
<br>

![Regular paste](resources/regular_paste.gif)
![Smart paste](resources/smart_paste.gif)

> Regular paste (left) | Smart paste (right).

## Commands

You can view the available commands by pressing `Ctrl + P`.

-   **Renumber at Cursor**: This command will renumber the list starting from the current cursor position, allowing you to make quick adjustments as needed.
-   **Renumber Selected Lists**: If you highlight multiple numbered lists, this command renumbers all of them at once.
-   **Renumber Entire Note**: For a comprehensive update, this command renumbers every numbered list in your active note, ensuring complete consistency.

## Performance

The live update feature renumbers lists locally, adjusting the current line based on the previous line until it reaches the first correctly numbered line, which minimizes unnecessary calculations.
In addition, the plugin was tested with documents containing lists with over 10,000 lines, and no performance issues were found on my machine.

## Limitations

The plugin does not support automatic renumbering in Vim mode, but you can still trigger renumbering commands manually. Additionally, it requires manual specification of tab sizes for correct nested numbering, as automatic detection is not available.
