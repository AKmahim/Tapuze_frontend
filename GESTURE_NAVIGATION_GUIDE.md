# Android Gesture Navigation Configuration

This guide explains the changes made to fix the Android back gesture issue and how to customize the behavior.

## Problem Solved

The original issue was that the Android back gesture (swipe from left edge) was causing the app to exit instead of navigating back within the app.

## Changes Made

### 1. App.js Updates
- Added proper imports for Android back button handling
- Wrapped the app with `gestureHandlerRootHOC` for better gesture support
- Added navigation ref for programmatic navigation control
- Implemented custom back press handling logic
- Configured gesture settings for both Android and iOS

### 2. app.json Configuration
- Added Android-specific navigation settings
- Added status bar and navigation bar configurations
- Added screen orientation plugin

### 3. Navigation Helpers (utils/navigationHelpers.js)
- Created reusable functions for gesture configuration
- Implemented customizable back press handling
- Added support for double-back-to-exit pattern
- Created options for gesture response distance

## Features Implemented

### ✅ Gesture Navigation
- **Swipe from left edge** to go back (works on all screens except root screens)
- **Customizable gesture sensitivity** (50px from edge by default)
- **Smooth animations** with proper timing configurations

### ✅ Smart Back Button Handling
- **Root screens** (Dashboard screens): Shows exit confirmation dialog
- **Regular screens**: Navigates back to previous screen
- **Prevents accidental exits** by requiring confirmation

### ✅ Cross-Platform Support
- **Android**: Full gesture support with custom configurations
- **iOS**: Utilizes native iOS gesture handling (already optimized)

## How to Test

### On Android Device:
1. Install the app on your Android device
2. Navigate through different screens
3. Try swiping from the left edge of the screen to go back
4. On dashboard screens, try the back gesture - should show exit confirmation
5. On other screens, back gesture should navigate to previous screen

### Testing Commands:
```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android device
npm run android
```

## Customization Options

### 1. Adjust Gesture Sensitivity
In `utils/navigationHelpers.js`, modify the `gestureResponseDistance`:

```javascript
gestureResponseDistance: {
  horizontal: 75, // Increase for larger gesture area (default: 50)
},
```

### 2. Change Animation Duration
Modify the `transitionSpec` in the helper file:

```javascript
transitionSpec: {
  open: {
    animation: 'timing',
    config: {
      duration: 400, // Slower animation (default: 300)
    },
  },
}
```

### 3. Customize Exit Dialog
In `App.js` or use the helper function with custom handler:

```javascript
const customExitHandler = () => {
  Alert.alert(
    'Custom Title',
    'Custom message here',
    [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave', onPress: () => BackHandler.exitApp() },
    ]
  );
};

// Use in useEffect:
handleAndroidBackPress(navigationRef, customExitHandler);
```

### 4. Add Double-Back-to-Exit
You can implement a double-back pattern for root screens by modifying the back handler:

```javascript
let backPressCount = 0;
const doubleBackHandler = () => {
  if (backPressCount === 1) {
    BackHandler.exitApp();
  } else {
    backPressCount = 1;
    ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
    setTimeout(() => { backPressCount = 0; }, 2000);
  }
};
```

### 5. Disable Gestures on Specific Screens
Add to individual screen options:

```javascript
<Stack.Screen
  name="SpecialScreen"
  component={SpecialScreenComponent}
  options={{
    gestureEnabled: false, // Disable gesture for this screen
  }}
/>
```

## Troubleshooting

### Gesture Not Working?
1. Make sure `react-native-gesture-handler` is properly installed
2. Check that the app is wrapped with `gestureHandlerRootHOC`
3. Verify Android system gesture navigation is enabled

### Still Exiting App Accidentally?
1. Increase the `gestureResponseDistance` value
2. Add double-back-to-exit pattern
3. Check if you're on a root screen (should show confirmation dialog)

### Performance Issues?
1. Reduce animation duration
2. Use `spring` animation instead of `timing` for smoother feel
3. Consider disabling gestures on heavy screens

## Additional Resources

- [React Navigation Gesture Documentation](https://reactnavigation.org/docs/stack-navigator#gestures)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Android Navigation Gestures](https://developer.android.com/guide/navigation/navigation-swipe)

## Support

If you encounter any issues:
1. Check the console for error messages
2. Test on different Android versions
3. Verify that all dependencies are up to date
4. Consider device-specific gesture settings
