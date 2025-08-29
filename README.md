# Cursor File Shortcuts

A CLI tool to open files from `shortcuts.json` in Cursor editor with dynamic commands.

## Installation

```bash
npm install -g cursor-shortcuts
```

## Usage

### List Available Commands

```bash
s list
```

This will show all available shortcuts with their descriptions, file counts, and individual file paths. Files are marked with ✅ if they exist or ❌ if they don't exist.

Example output:

```
Available shortcuts:

  playground:save
    Description: Open playground save files in Cursor
    Files: 2 file(s)
      1. ✅ next/app/api/playground/route.ts
      2. ✅ next/app/(scrollable-none)/playground/components/Layout.tsx

  auth:files
    Description: Open authentication related files
    Files: 2 file(s)
      1. ❌ next/app/auth/sign-in.tsx
      2. ❌ next/app/auth/sign-up.tsx
```

### Dynamic Commands

The CLI tool automatically creates commands based on your `shortcuts.json` file. Each key in the JSON becomes a command.

Given a `shortcuts.json` file like:

```json
{
  "playground:save": {
    "description": "Open playground save files in Cursor",
    "files": ["next/app/api/playground/route.ts", "next/app/(scrollable-none)/playground/components/Layout.tsx"]
  },
  "auth:files": {
    "description": "Open authentication related files",
    "files": ["next/app/auth/sign-in.tsx", "next/app/auth/sign-up.tsx"]
  }
}
```

You can run:

```bash
s playground:save
s auth:files
```

Each command will open the corresponding files in Cursor.

## Shortcuts.json Format

The `shortcuts.json` file should be placed in your project root and follow this structure:

```json
{
  "command-name": {
    "description": "Description of what this command does",
    "files": ["path/to/file1.ts", "path/to/file2.tsx"]
  }
}
```

### Key Features:

- **Dynamic Commands**: Any key you add to the JSON becomes a command
- **Descriptions**: Each command can have a helpful description
- **Multiple Files**: Each command can open multiple files at once
- **Relative Paths**: File paths are relative to the project root
- **Special Characters**: Handles file paths with parentheses and other special characters

## Requirements

- Node.js >= 14.0.0
- Cursor editor installed and accessible via `cursor` command
- `shortcuts.json` file in the project root or any parent directory

## Features

- Automatically finds `shortcuts.json` in parent directories
- Dynamic command generation based on JSON structure
- Handles multiple file entries per command
- Validates file existence before opening
- Provides helpful error messages and command listing
- Shows file paths with existence status in list command
- Works with relative paths in `shortcuts.json`
- Properly escapes file paths with special characters

## Examples

See `example-shortcuts.json` for more examples of how to structure your shortcuts file.

## License

MIT
https://registry.npmjs.org/ with tag latest and default access

- cursor-shortcuts@1.0.0
