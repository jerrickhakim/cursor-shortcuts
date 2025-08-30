#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Function to find shortcuts.json file
function findShortcutsFile() {
  let currentDir = process.cwd();
  const maxDepth = 10; // Prevent infinite loops

  for (let i = 0; i < maxDepth; i++) {
    const shortcutsPath = path.join(currentDir, "shortcuts.json");
    if (fs.existsSync(shortcutsPath)) {
      return shortcutsPath;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break; // Reached root directory
    }
    currentDir = parentDir;
  }

  return null;
}

// Function to open files in Cursor
function openInCursor(files) {
  if (!files || files.length === 0) {
    console.log("No files found to open");
    return;
  }

  // Get absolute paths for all files
  const shortcutsDir = path.dirname(findShortcutsFile());
  const absolutePaths = files.map((file) => path.resolve(shortcutsDir, file));

  // Filter out files that don't exist
  const existingFiles = absolutePaths.filter((file) => fs.existsSync(file));

  if (existingFiles.length === 0) {
    console.log("No existing files found to open");
    return;
  }

  // Open files in Cursor - escape file paths to handle special characters
  const escapedFiles = existingFiles.map((file) => `"${file}"`);
  const cursorCommand = `cursor ${escapedFiles.join(" ")}`;

  exec(cursorCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening files in Cursor: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Cursor stderr: ${stderr}`);
    }
    console.log(`Opened ${existingFiles.length} file(s) in Cursor`);
  });
}

// Function to load shortcuts
function loadShortcuts() {
  const shortcutsPath = findShortcutsFile();

  if (!shortcutsPath) {
    console.error("Error: shortcuts.json not found in current directory or any parent directory");
    process.exit(1);
  }

  try {
    const shortcutsContent = fs.readFileSync(shortcutsPath, "utf8");
    return JSON.parse(shortcutsContent);
  } catch (error) {
    console.error(`Error reading shortcuts.json: ${error.message}`);
    process.exit(1);
  }
}

// Function to get shortcut by index
function getShortcutByIndex(shortcuts, index) {
  const shortcutKeys = Object.keys(shortcuts);
  if (index >= 0 && index < shortcutKeys.length) {
    const key = shortcutKeys[index];
    return { key, config: shortcuts[key] };
  }
  return null;
}

// Main CLI logic
program.name("s").description("CLI tool to open files from shortcuts.json in Cursor").version("1.0.0");

// Load shortcuts and create dynamic commands
const shortcuts = loadShortcuts();

// Add a command to list all available shortcuts
program
  .command("list")
  .description("List all available shortcuts")
  .action(() => {
    console.log("Available shortcuts:");
    console.log("");

    Object.entries(shortcuts).forEach(([command, config], index) => {
      console.log(`  ${index}. ${command}`);
      console.log(`    Description: ${config.description}`);
      console.log(`    Files: ${config.files.length} file(s)`);

      // Show file paths
      config.files.forEach((file, fileIndex) => {
        const filePath = path.resolve(path.dirname(findShortcutsFile()), file);
        const exists = fs.existsSync(filePath);
        const status = exists ? "✅" : "❌";
        console.log(`      ${fileIndex + 1}. ${status} ${file}`);
      });

      console.log("");
    });
  });

// Create dynamic commands for each shortcut
Object.entries(shortcuts).forEach(([command, config]) => {
  program
    .command(command)
    .description(config.description)
    .action(() => {
      openInCursor(config.files);
    });
});

// Handle the case where the command is passed as an argument
if (process.argv.length > 2) {
  const command = process.argv[2];

  if (command === "list") {
    console.log("Available shortcuts:");
    console.log("");

    Object.entries(shortcuts).forEach(([cmd, config], index) => {
      console.log(`  ${index}. ${cmd}`);
      console.log(`    Description: ${config.description}`);
      console.log(`    Files: ${config.files.length} file(s)`);

      // Show file paths
      config.files.forEach((file, fileIndex) => {
        const filePath = path.resolve(path.dirname(findShortcutsFile()), file);
        const exists = fs.existsSync(filePath);
        const status = exists ? "✅" : "❌";
        console.log(`      ${fileIndex + 1}. ${status} ${file}`);
      });

      console.log("");
    });
  } else if (command === "--help" || command === "-h") {
    program.help();
  } else if (shortcuts[command]) {
    // Handle named command
    openInCursor(shortcuts[command].files);
  } else if (!isNaN(command)) {
    // Handle numeric index
    const index = parseInt(command);
    const shortcut = getShortcutByIndex(shortcuts, index);

    if (shortcut) {
      console.log(`Opening shortcut ${index}: ${shortcut.key}`);
      openInCursor(shortcut.config.files);
    } else {
      console.error(`Invalid index: ${index}. Use 's list' to see available shortcuts.`);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    console.log("Use 's list' to see available commands");
    console.log("You can also use numeric indices (0, 1, 2, etc.) to open shortcuts by position");
    process.exit(1);
  }
} else {
  program.parse();
}
