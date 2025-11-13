import { ConfigPlugin } from "expo/config-plugins";
import withGodotFiles from "./withGodotFiles";
import withPckFile from "./withPckFile";

const withPlugin: ConfigPlugin = (config) => {
  // Copy Godot files to Android assets
  config = withGodotFiles(config);
  // Copy main.pck to iOS project
  return withPckFile(config);
};

export default withPlugin;
