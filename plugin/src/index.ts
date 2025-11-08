import { ConfigPlugin } from "expo/config-plugins";
import withPckFile from "./withPckFile";

const withPlugin: ConfigPlugin = (config) => {
  return withPckFile(config);
};

export default withPlugin;
