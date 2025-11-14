import {
  RTNGodot,
  RTNGodotView,
  runOnGodotThread,
} from "@borndotcom/react-native-godot";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const ACTION_JUMP = "ui_accept";
const ACTION_MOVE_LEFT = "ui_left";
const ACTION_MOVE_RIGHT = "ui_right";

function initGodot() {
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    initGodot();
    return () => {};
  }, []);

  const handlePlayPause = () => {
    if (isPaused) {
      RTNGodot.resume();
      setIsPaused(false);
    } else {
      RTNGodot.pause();
      setIsPaused(true);
    }
  };

  return (
    <View style={styles.container}>
      <RTNGodotView style={styles.gameView} />

      {/* Top corner - Play/Pause button */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPaused ? "play" : "pause"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Left side controls - Direction buttons */}
      <View style={styles.leftControls}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction(ACTION_MOVE_LEFT)}
          onPressOut={() => releaseAction(ACTION_MOVE_LEFT)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => pressAction(ACTION_MOVE_RIGHT)}
          onPressOut={() => releaseAction(ACTION_MOVE_RIGHT)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Right side controls - Jump button */}
      <View style={styles.rightControls}>
        <TouchableOpacity
          style={[styles.button, styles.jumpButton]}
          onPressIn={() => pressAction(ACTION_JUMP)}
          onPressOut={() => releaseAction(ACTION_JUMP)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-up" size={36} color="white" />
        </TouchableOpacity>
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
  },
  topControls: {
    position: "absolute",
    top: 40,
    right: 30,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  leftControls: {
    position: "absolute",
    bottom: 40,
    left: 30,
    flexDirection: "row",
    gap: 20,
  },
  rightControls: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  jumpButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(220, 38, 38, 0.7)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
});
