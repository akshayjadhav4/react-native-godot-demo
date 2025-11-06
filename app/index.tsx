import {
  RTNGodot,
  RTNGodotView,
  runOnGodotThread,
} from "@borndotcom/react-native-godot";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import { useEffect } from "react";

function initGodot() {
  const { width, height } = Dimensions.get("window");

  runOnGodotThread(() => {
    "worklet";
    console.log("Initializing Godot");

    if (Platform.OS === "android") {
      RTNGodot.createInstance([
        "--verbose",
        "--path",
        "/main",
        "--rendering-driver",
        "opengl3",
        "--rendering-method",
        "gl_compatibility",
        "--display-driver",
        "embedded",
      ]);
    } else {
      RTNGodot.createInstance([
        "--verbose",
        "--main-pack",
        FileSystem.bundleDirectory + "main.pck",
        "--rendering-driver",
        "opengl3",
        "--rendering-method",
        "gl_compatibility",
        "--display-driver",
        "embedded",
      ]);
    }

    // Configure viewport after initialization
    try {
      const Godot = RTNGodot.API();
      const engine = Godot.Engine;
      const sceneTree = engine.get_main_loop();
      const root = sceneTree.get_root();

      // Set viewport to window size
      root.set_size(Godot.Vector2i(Math.floor(width), Math.floor(height)));

      // Configure content scaling mode
      root.set_content_scale_mode(1); // CONTENT_SCALE_MODE_CANVAS_ITEMS
      root.set_content_scale_aspect(1); // CONTENT_SCALE_ASPECT_KEEP

      console.log(
        `Godot viewport configured: ${Math.floor(width)}x${Math.floor(height)}`
      );
    } catch (error) {
      console.error("Error configuring Godot viewport:", error);
    }
  });
}

function pressAction(action: string) {
  runOnGodotThread(() => {
    "worklet";
    try {
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_press(action);
    } catch (error) {
      console.error("Error pressing action:", error);
    }
  });
}

function releaseAction(action: string) {
  runOnGodotThread(() => {
    "worklet";
    try {
      const Godot = RTNGodot.API();
      const Input = Godot.Input;
      Input.action_release(action);
    } catch (error) {
      console.error("Error releasing action:", error);
    }
  });
}

export default function Index() {
  useEffect(() => {
    initGodot();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <RTNGodotView style={styles.gameView} />

      {/* Control Buttons - All on Left Side */}
      <View style={styles.leftControls}>
        <View style={styles.movementRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.leftButton,
              pressed && styles.buttonPressed,
            ]}
            onPressIn={() => pressAction("ui_left")}
            onPressOut={() => releaseAction("ui_left")}
          >
            <Text style={styles.buttonText}>◄</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.rightButton,
              pressed && styles.buttonPressed,
            ]}
            onPressIn={() => pressAction("ui_right")}
            onPressOut={() => releaseAction("ui_right")}
          >
            <Text style={styles.buttonText}>►</Text>
          </Pressable>
        </View>

        {/* Jump Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.jumpButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            pressAction("ui_accept");
            // Release after a short delay to simulate a key press
            setTimeout(() => releaseAction("ui_accept"), 100);
          }}
        >
          <Text style={styles.buttonText}>▲</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameView: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  leftControls: {
    position: "absolute",
    bottom: 30,
    left: 20,
    gap: 8,
  },
  movementRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "rgba(0, 122, 255, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 50,
    minHeight: 50,
  },
  buttonPressed: {
    backgroundColor: "rgba(0, 122, 255, 1)",
    transform: [{ scale: 0.95 }],
  },
  leftButton: {},
  rightButton: {},
  jumpButton: {
    backgroundColor: "rgba(255, 59, 48, 0.8)",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
