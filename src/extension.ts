import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { MyToolsProvider } from './myToolsProvider';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "effect-tools" is now active!');

  // 设置全局代理
	const globalDelegateCmd = vscode.commands.registerCommand('effectTools.setGlobalDelegate', (command: string, params: string[]) => {
    if (params && params.includes('showTerminal')) { // 显示终端
      const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
      let terminal = terminals.find(t => t.name === "my-tools");
      if (terminal) {
        terminal.show();
      } else {
        terminal = vscode.window.createTerminal({ name: "my-tools", location:vscode.TerminalLocation.Editor });
      };
      terminal.sendText(command);
      return;
    }
    // node执行命令
    childProcess.exec(command, (error, _, stderr) => {
      if(error){
        console.log(`执行错误信息：${error}`);
        return;
      }
      if (stderr) {
        vscode.window.showErrorMessage(`设置错误${stderr}`);
        return;
      }
      vscode.window.showInformationMessage("设置成功");
    });
	});
	context.subscriptions.push(globalDelegateCmd);

  // 注册工具provider
  const myToolsProvider = vscode.window.registerTreeDataProvider('effectTools.myTools', new MyToolsProvider());
  context.subscriptions.push(myToolsProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
