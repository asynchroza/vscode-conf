import fs from "fs";
import os from "os";
import path from "path";

// accept flag to be verbose
const verbose = process.argv.includes("-v");

// Check OS
if (os.platform() !== "darwin") {
  console.log("This script is for OSX only. Exiting.");
  process.exit(1);
}

const OSX_CODE_DIR = path.join(
  os.homedir(),
  "Library",
  "Application Support",
  "Code",
  "User",
);
const keybindingsPath = path.join(__dirname, "keybindings.json");
const backupPath = path.join(OSX_CODE_DIR, "keybindings-backup.json");

// Make a backup of keybindings.json
fs.renameSync(path.join(OSX_CODE_DIR, "keybindings.json"), backupPath);

// Symlink keybindings.json to user's Code directory
fs.symlinkSync(keybindingsPath, path.join(OSX_CODE_DIR, "keybindings.json"));

// Load settings.json file from user's Code directory
const settingsPath = path.join(OSX_CODE_DIR, "settings.json");
console.log(settingsPath);

// Parse settings.json to object
let settings = {};
try {
  settings = JSON.parse(
    fs
      .readFileSync(settingsPath, "utf8")
      .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/|\#.*)/g, (m, g) =>
        g ? "" : m,
      ),
  );
} catch (error) {
  console.error("Error parsing settings.json.");
  if (verbose) {
    console.error(error);
  }
  exit(1);
}

// Make a backup of settings.json
try {
  fs.renameSync(settingsPath, path.join(OSX_CODE_DIR, "settings-backup.json"));
} catch (error) {
  console.error("Error backing up settings.json.");
  if (verbose) {
    console.error(error);
  }

  exit(1);
}

// Load repo settings.json file and merge the objects
const repoSettings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "settings.json"), "utf8"),
);

const mergedSettings = { ...settings, ...repoSettings };
console.log("Merged settings: ", mergedSettings);

// Write the merged settings to the user's Code directory
fs.writeFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2));

console.log("Keybindings and settings installed successfully!");
