# React Native Godot + Expo Demo

A demonstration project showing how to integrate [React Native Godot](https://github.com/borndotcom/react-native-godot) by `borndotcom` with [Expo](https://expo.dev). This project showcases embedding the Godot Engine into an Expo React Native application with custom touch controls and game interaction.

## 🎮 What is this?

This project demonstrates:
- **Godot Engine Integration**: Running Godot games within an Expo app
- **Cross-Platform Support**: Works on both iOS and Android
- **Custom Controls**: Touch-based game controls overlaid on the Godot view
- **Godot API Access**: Direct interaction with Godot's Input system from React Native
- **Custom Expo Plugin**: Automatic handling of Godot `.pck` files for iOS builds

## 📸 Screenshots
  <img src="demo/1.PNG"  alt="Screenshot 1" />
  <img src="demo/2.PNG"  alt="Screenshot 2" />
  <img src="demo/3.PNG"  alt="Screenshot 3" />
  <img src="demo/4.PNG"  alt="Screenshot 4" />


## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

```bash
pnpm run download-prebuilt
```
This way React Native Godot can be updated independently from LibGodot, and also local, customized builds of LibGodot are supported.

Also automatically build the custom Expo config plugin.

### 2. Add Your Godot Game

Place your exported Godot game file at:

```
assets/godot/main.pck
```

**Note**: The included `main.pck` is a sample platformer game. Replace it with your own Godot game export.

### 3. Run on iOS

```bash
pnpm ios
```

The custom Expo plugin will automatically copy the `.pck` file to the iOS project and add it to Xcode resources.


## 📁 Project Structure

```
godot-app/
├── app/                      # Main application screens
│   ├── index.tsx            # Home screen with Godot integration
│   └── _layout.tsx          # Navigation layout
├── assets/
│   └── godot/
│       └── main.pck         # Godot game package file
├── plugin/                   # Custom Expo config plugin
│   └── src/
│       ├── index.ts         # Plugin entry point
│       └── withPckFile.ts   # iOS .pck file integration
├── app.plugin.js            # Plugin configuration
└── app.json                 # Expo configuration
```

## 🎯 Key Features

### Custom Game Controls

The demo includes touch controls that interact with the Godot game:

- **Left Arrow**: Move left (`ui_left` action)
- **Right Arrow**: Move right (`ui_right` action)
- **Jump Button**: Jump (`ui_accept` action)

These controls use Godot's Input API through worklets for thread-safe communication.

### Custom Expo Config Plugin

The project includes a custom Expo plugin (`plugin/src/withPckFile.ts`) that:
- Automatically copies `main.pck` from assets to the iOS project
- Adds the file to Xcode project resources
- Ensures proper build configuration for iOS

## 🔧 Configuration

### App Configuration (`app.json`)

Key settings:
- **Orientation**: Set to `landscape` for game display
- **Custom Plugin**: Configured to handle Godot assets

## 🎮 How It Works

### 1. Godot Thread Execution

All Godot operations run on a dedicated thread using worklets:

```typescript
runOnGodotThread(() => {
  'worklet';
  const Godot = RTNGodot.API();
  // Godot operations here
});
```

### 2. Input Handling

The app demonstrates sending input events to Godot:

```typescript
function pressAction(action: string) {
  runOnGodotThread(() => {
    'worklet';
    const Godot = RTNGodot.API();
    const Input = Godot.Input;
    Input.action_press(action);
  });
}
```

### 3. View Integration

The Godot view is embedded as a React Native component:

```typescript
<RTNGodotView style={styles.gameView} />
```

## 📱 Platform-Specific Notes

### iOS
- Game file is bundled as `main.pck` in the app bundle
- Custom Expo plugin handles Xcode project integration
- File accessed via `FileSystem.bundleDirectory`

## 📚 Resources

### Make simple game with Godot
- [Godot Beginner Tutorial](https://youtu.be/LOhfqjmasi0?si=EGMVRKSGOUvXUVnJ)

### React Native Godot
- [GitHub Repository](https://github.com/borndotcom/react-native-godot)

## 🎨 Game Assets & Credits

The demo platformer game included in this project uses assets from the Brackeys Godot tutorial. All assets have been repackaged and many have been modified by Brackeys.

### License

**Creative Commons Zero (CC0)** - Free to use for any purpose

### Credits

**Sprites by analogStudios_:**
- Knight - [Camelot Pack](https://analogstudios.itch.io/camelot)
- Slime - [Dungeon Sprites](https://analogstudios.itch.io/dungeonsprites)
- Platforms and Coin - [Four Seasons Platformer Sprites](https://analogstudios.itch.io/four-seasons-platformer-sprites)

**Sprites by RottingPixels:**
- World Tileset and Fruit - [Four Seasons Platformer Tileset](https://rottingpixels.itch.io/four-seasons-platformer-tileset-16x16free)

**Sounds:**
- Brackeys, Asbjørn Thirslund

**Music:**
- Brackeys, Sofia Thirslund

**Fonts by Jayvee Enaguas (HarvettFox96):**
- [Pixel Operator](https://www.dafont.com/pixel-operator.font?l[]=10&l[]=1)

---

Built with ❤️ using [React Native Godot](https://github.com/borndotcom/react-native-godot) and [Expo](https://expo.dev)
