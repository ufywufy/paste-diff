# paste-diff README

Live paste diff to instantly visualize changes after you paste a section of code.
Vibe code more intelligently, no more blind pastes.

## Features

VS Code side by side diff: Opens a fresh diff editor for each large paste or replacement, aligning original vs. new content.

Custom thresholds: Configure how many characters pasted or replaced will trigger the diff view, default is 100 chars.

![Paste Diff Demo](https://raw.githubusercontent.com/ufywufy/paste-diff/main/images/demo.gif)

## Requirements

VS Code 1.100.0 or higher.

No external dependencies beyond the built in diff-match-patch package (bundled automatically).

## Extension Settings

This extension contributes the following settings:

* `pasteDiff.minSize`: Minimum number of characters pasted or replaced to open the diff using ctrl+v
* `pasteDiff.forceDiff`: Customizable force diff keybind, does not rely on minimum number of characters
Disabled by default: to enable, replace "CUSTOM+KEYBIND" with something like "ctrl+alt+d"
and remove the "&& false" condition.

## Known Issues

Please let me know if you find issues.

## Release Notes

### 1.0.0

Initial release.

### 1.0.1

+ new forceDiff keybind (edit through keyboard shortcuts)
+ added command Paste Diff: Open Settings
+ added command forceDiff

**Enjoy!**

https://github.com/ufywufy