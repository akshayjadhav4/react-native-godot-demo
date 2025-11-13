import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

/**
 * Recursively copy a directory
 */
function copyDirectory(src: string, dest: string): void {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all files and directories from source
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Expo config plugin to copy godot-files/main folder to Android assets
 * @param config - Expo config
 */
const withGodotFiles: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;

      // Source path: assets/godot/godot-files/main
      const sourcePath = path.join(
        projectRoot,
        "assets",
        "godot",
        "godot-files",
        "main"
      );

      // Destination path: android/app/src/main/assets/main
      const destPath = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "assets",
        "main"
      );

      // Check if source directory exists
      if (!fs.existsSync(sourcePath)) {
        console.warn(`Godot files not found at ${sourcePath}`);
        return config;
      }

      // Ensure the assets directory exists
      const assetsDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "assets"
      );
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      // Copy the directory
      try {
        copyDirectory(sourcePath, destPath);
        console.log(`Copied Godot files from ${sourcePath} to ${destPath}`);
      } catch (error) {
        console.error(`Error copying Godot files: ${error}`);
      }

      return config;
    },
  ]);
};

export default withGodotFiles;
