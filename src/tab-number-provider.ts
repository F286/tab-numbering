import * as vscode from 'vscode';

/**
 * Supplies numeric badges (“1”, “2”, …) for editor tabs.
 */
export class TabNumberProvider implements vscode.FileDecorationProvider {
    /* ---------------------------------------------------------------- *
     * 1.  Event that VS Code listens to so it knows when to re‑query   *
     *     our decorations.                                             *
     * ---------------------------------------------------------------- */
    private readonly _emitter =
        new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
    readonly onDidChangeFileDecorations = this._emitter.event;

    /* Map each file‑URI (string) → current tab index (1‑based). */
    private readonly uriToIndex = new Map<string, number>();

    /**
     * Call this whenever tabs/groups change so numbers stay in sync.
     * Walks every tab in visual order and (re)builds the map.
     */
    updateTabIndices(groups: readonly vscode.TabGroup[]): void {
        this.uriToIndex.clear();

        let counter = 1;
        for (const g of groups) {
            for (const tab of g.tabs) {
                // TabInputText and TabInputTextDiff both expose a `uri`
                const input = tab.input as { uri?: vscode.Uri };
                if (input?.uri) {
                    this.uriToIndex.set(input.uri.toString(), counter++);
                }
            }
        }
        /* Notify VS Code that decorations may have changed. */
        this._emitter.fire(undefined);          // undefined ⇒ refresh everything
    }

    /* VS Code calls this for any URI it wants to decorate */
    provideFileDecoration(
        uri: vscode.Uri
    ): vscode.ProviderResult<vscode.FileDecoration> {
        console.log('provide', uri.fsPath, '→', this.uriToIndex.get(uri.toString()));
        const n = this.uriToIndex.get(uri.toString());
        return n
            ? new vscode.FileDecoration(String(n), `Tab ${n}`)
            : undefined;
    }
}