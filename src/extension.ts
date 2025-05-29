import * as vscode from "vscode";
import * as path from "path";

let lastOriginalText = "";
let lastDocUri: vscode.Uri | undefined;

const provider: vscode.TextDocumentContentProvider = {
  provideTextDocumentContent(_uri: vscode.Uri): string {
    return lastOriginalText;
  }
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider("paste-diff", provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pasteDiff.handlePaste", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return vscode.commands.executeCommand("editor.action.clipboardPasteAction");
      }

      const doc     = editor.document;
      const config  = vscode.workspace.getConfiguration("pasteDiff");
      const minSize = config.get<number>("minSize", 100);
      const clip    = await vscode.env.clipboard.readText();

      const replacedLen = editor.selections.reduce(
        (sum, sel) => sum + doc.getText(sel).length,
        0
      );

      if (clip.length < minSize && replacedLen < minSize) {
        return vscode.commands.executeCommand("editor.action.clipboardPasteAction");
      }

      lastOriginalText = doc.getText();
      lastDocUri       = doc.uri;

      await vscode.commands.executeCommand("editor.action.clipboardPasteAction");

      const oldLines = lastOriginalText.split("\n");
      const newLines = doc.getText().split("\n");
      const onlyIndentChanges =
        oldLines.length === newLines.length &&
        oldLines.every((oldLine, i) => oldLine.trimEnd() === newLines[i].trimEnd());

      if (onlyIndentChanges) {
        lastOriginalText = "";
        lastDocUri       = undefined;
        vscode.window.showInformationMessage("Only indentation changed – no content differences to show.");
        return;
      }

      const ext     = path.extname(doc.uri.fsPath) || ".txt";
      const virtUri = vscode.Uri.parse(`paste-diff://diff/original${ext}`);

      const baseName = path.basename(doc.uri.fsPath, ext);
      const title    = `Paste Diff (${baseName})`;

      await vscode.commands.executeCommand(
        "vscode.diff",
        virtUri,
        doc.uri,
        title,
        { preview: false }
      );
    })
  );
}

export function deactivate() {}
