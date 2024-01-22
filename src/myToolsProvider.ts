import * as vscode from 'vscode';

class MyTool {
  constructor(
    public readonly group: string, // group内容
    public readonly children: Child[],
    public readonly icon?: string // icon
  ) {}
}

enum CommandType {
  globalDelegate = "globalDelegate",
  terminal = "terminal",
}

class Child {
  constructor(
    public readonly name: string, // 工具名称
    public readonly command: string, // 命令
    public readonly type: CommandType, // 命令类型
    public readonly icon?: string, // icon
    public readonly params?: string[], // 命令参数类型
  ) {}
}

export class MyToolsProvider implements vscode.TreeDataProvider<MyTool | Child> {
  private tools: MyTool[];
  constructor() {
    const myTools: MyTool[] = require('../resource/mytools.json');
    this.tools = myTools.map((t: MyTool) => {
      if (t.children) {
        return new MyTool(t.group, t.children.map((c: Child) => {
          return new Child(c.name, c.command, CommandType.globalDelegate, c.icon, c.params);
        }), t.icon);
      }
      return new MyTool(t.group, []);
    });
  }
  
  getTreeItem(element: MyTool | Child): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if (element instanceof MyTool) {
      const treeItem = new vscode.TreeItem(element.group, vscode.TreeItemCollapsibleState.Collapsed);
      treeItem.iconPath = new vscode.ThemeIcon(element.icon ? element.icon : 'group-by-ref-type');
      return treeItem;
    }
    // child
    const treeItem = new vscode.TreeItem(element.name);
    treeItem.iconPath = new vscode.ThemeIcon(element.icon ? element.icon : 'file');
    // 终端命令
    if (element.type === CommandType.globalDelegate) { // 全局代理命令
      treeItem.command = {
        command: 'effectTools.setGlobalDelegate',
        title: 'Open',
        arguments: [element.command, element.params]
      };
      return treeItem;
    }
    return treeItem;
  }

  getChildren(element?: MyTool | Child | undefined): vscode.ProviderResult<(MyTool | Child)[]> {
    if (!element) {
      return this.tools;
    }
    if (element instanceof MyTool) {
      return element.children;
    }
  }
}