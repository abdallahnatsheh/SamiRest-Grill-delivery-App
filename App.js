import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MainDrawer from "./navigation/MainDrawer";
import AuthContext from "./context/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {
  SignIn,
  ForgotPassword,
  DeliveryStatus,
  Map,
  Support,
  Settings,
  ChangePassword,
  MyAccount,
  MyAccountEdit,
  OrderList,
  AboutUs,
  PrivacyPolicy,
  TermsConditions,
} from "./screens";
import { navigationRef } from "./navigation/rootNavigation";

const Stack = createStackNavigator();
const customFonts = {
  TajawalMedium: require("./assets/fonts/TajawalMedium.ttf"),
  ElMessiriBold: require("./assets/fonts/ElMessiriBold.ttf"),
  ElMessiriSemiBold: require("./assets/fonts/ElMessiriSemiBold.ttf"),
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(customFonts);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
      <NavigationContainer ref={navigationRef}>
        <AuthContext>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={"Home"}
          >
            <Stack.Screen name="Home" component={MainDrawer} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

            <Stack.Screen
              name="DeliveryStatus"
              component={DeliveryStatus}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="MyAccount" component={MyAccount} />
            <Stack.Screen name="MyAccountEdit" component={MyAccountEdit} />
            <Stack.Screen name="OrderList" component={OrderList} />

            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Support" component={Support} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
          </Stack.Navigator>
        </AuthContext>
      </NavigationContainer>
  );
};

export default App;
