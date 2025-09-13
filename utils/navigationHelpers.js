import { Platform, BackHandler, Alert } from 'react-native';

/**
 * Configure navigation options for better gesture support on Android
 */
export const getScreenOptions = (route, navigation) => ({
  // Enable gestures for all platforms
  gestureEnabled: true,
  
  // Configure gesture direction
  gestureDirection: 'horizontal',
  
  // Android specific configurations
  ...(Platform.OS === 'android' && {
    animation: 'slide_from_right',
    
    // Custom back behavior
    headerLeft: () => {
      // You can customize the back button behavior here if needed
      return null; // Use default back button
    },
    
    // Gesture response distance - how far from edge to trigger gesture
    gestureResponseDistance: {
      horizontal: 50, // Distance from screen edge in pixels
    },
    
    // Animation configuration
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 300,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 250,
        },
      },
    },
  }),
  
  // iOS specific configurations
  ...(Platform.OS === 'ios' && {
    // iOS already has good gesture support by default
    gestureResponseDistance: {
      horizontal: 50,
    },
  }),
});

/**
 * Handle hardware back press on Android
 */
export const handleAndroidBackPress = (navigationRef, customExitHandler = null) => {
  if (Platform.OS === 'android') {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.current) {
        const currentRoute = navigationRef.current.getCurrentRoute();
        
        // Define root screens where back press should show exit confirmation
        const rootScreens = ['StudentDashboard', 'LecturerDashboard', 'Auth'];
        
        if (rootScreens.includes(currentRoute?.name)) {
          // Use custom exit handler if provided, otherwise use default
          if (customExitHandler) {
            customExitHandler();
          } else {
            Alert.alert(
              'Exit App',
              'Are you sure you want to exit the application?',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: 'Exit',
                  onPress: () => BackHandler.exitApp(),
                },
              ],
              { cancelable: false }
            );
          }
          return true; // Prevent default back behavior
        }
        
        // For other screens, let navigation handle the back action
        if (navigationRef.current.canGoBack()) {
          navigationRef.current.goBack();
          return true; // Prevent default back behavior
        }
      }
      
      return false; // Let default back behavior occur
    });

    return () => backHandler.remove();
  }
  
  return () => {}; // Return empty cleanup function for iOS
};

/**
 * Get navigation container options
 */
export const getNavigationContainerOptions = () => ({
  screenOptions: {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
  },
  
  // Enable linking for deep linking support
  linking: {
    prefixes: ['tapuze://'],
    config: {
      screens: {
        Auth: 'auth',
        Signup: 'signup',
        StudentDashboard: 'student',
        LecturerDashboard: 'lecturer',
        Classroom: 'classroom/:id',
        Profile: 'profile',
      },
    },
  },
});

/**
 * Configuration for preventing accidental exits
 */
export const preventAccidentalExit = {
  // Screens where double back press is required to exit
  doubleBackScreens: ['StudentDashboard', 'LecturerDashboard'],
  
  // Time window for double back press (in milliseconds)
  doubleBackTimeWindow: 2000,
  
  // Message to show on first back press
  doubleBackMessage: 'Press back again to exit',
};
