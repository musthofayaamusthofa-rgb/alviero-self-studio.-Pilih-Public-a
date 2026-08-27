
{
  "name": "bulk-rename-files",
  "displayName": "Bulk Rename Files",
  "description": "Rename banyak file sekaligus dengan dukungan penomoran (angka) dan perubahan huruf (case) dari VS Code Explorer.",
  "version": "1.0.0",
  "publisher": "local-user",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onCommand:bulkRename.start"
  ],
  "main": "./extension.js",
  "contributes": {
    "commands": [
      {
        "command": "bulkRename.start",
        "title": "Bulk Rename Files..."
      }
    ],
    "menus": {
      "explorer/context": [
        {
          "command": "bulkRename.start",
          "group": "7_modification",
          "when": "explorerResourceIsFolder == false"
        }
      ]
    }
  },
  "scripts": {
    "package": "vsce package"
  },
  "devDependencies": {
    "@vscode/vsce": "^2.24.0"
  }
}