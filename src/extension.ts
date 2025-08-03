// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TabNumberProvider } from './tab-number-provider';
//import * as vscode from 'vscode.FileDecorationProvider'

export function activate(ctx: vscode.ExtensionContext) {
	const provider = new TabNumberProvider();

	ctx.subscriptions.push(
		vscode.window.registerFileDecorationProvider(provider),
		vscode.window.tabGroups.onDidChangeTabs(() =>
			provider.updateTabIndices(vscode.window.tabGroups.all)
		),
		vscode.window.tabGroups.onDidChangeTabGroups(() =>
			provider.updateTabIndices(vscode.window.tabGroups.all)
		)
	);

	// Run once at startup
	provider.updateTabIndices(vscode.window.tabGroups.all);
}

// This method is called when your extension is deactivated
export function deactivate() { }
