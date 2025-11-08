import { ConfigPlugin, withXcodeProject } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

/**
 * Expo config plugin to copy main.pck file from assets/godot to iOS project
 * @param config - Expo config
 */
const withPckFiles: ConfigPlugin = (config) => {
  return withXcodeProject(config, async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const project = config.modResults;

    // Source path: assets/godot/main.pck
    const sourcePath = path.join(projectRoot, "assets", "godot", "main.pck");

    // Destination path: ios/main.pck (at the root of ios folder)
    const destPath = path.join(projectRoot, "ios", "main.pck");

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.warn("main.pck not found at assets/godot/main.pck");
      return config;
    }

    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log("Copied main.pck to iOS project");

    // Check if file already exists in the project
    const existingFile = project.hasFile("main.pck");
    if (existingFile) {
      console.log("main.pck already exists in Xcode project");
      return config;
    }

    // Get the main group (root group of the project)
    const firstProject = project.getFirstProject();
    const mainGroupKey = firstProject.firstProject.mainGroup;

    if (!mainGroupKey) {
      console.error("Could not find main group");
      return config;
    }

    console.log("Main group key:", mainGroupKey);

    // Add the file reference with proper encoding
    const file = project.addFile("main.pck", mainGroupKey, {
      lastKnownFileType: "file",
      defaultEncoding: 4,
    });

    if (!file) {
      console.log("Could not add file - it may already exist");
      return config;
    }

    console.log("Added file reference:", file.fileRef);

    // Get target UUID
    const targetUuid = project.getFirstTarget().uuid;
    console.log("Target UUID:", targetUuid);

    // Generate UUID for build file
    const buildFileUuid = project.generateUuid();

    // Manually add to PBXBuildFile section with target
    project.addToPbxBuildFileSection({
      uuid: buildFileUuid,
      isa: "PBXBuildFile",
      fileRef: file.fileRef,
      basename: "main.pck",
      group: "Resources",
    });

    console.log("Added to PBXBuildFile section");

    // Add to Resources build phase with target
    project.addToPbxResourcesBuildPhase({
      uuid: buildFileUuid,
      basename: "main.pck",
      group: "Resources",
      target: targetUuid,
    });

    console.log("Added to Resources build phase with target");

    return config;
  });
};

export default withPckFiles;
