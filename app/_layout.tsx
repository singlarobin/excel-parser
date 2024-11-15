import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <RootSiblingParent>
                <SafeAreaProvider>
                    <Stack>
                        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: true,
                                header: () => (
                                    <ScreenHeader headerName="Balance Connect" />
                                ),
                                statusBarStyle: "dark",
                            }}
                        />
                        <Stack.Screen
                            name="CustomerListRoute"
                            options={{
                                headerShown: true,
                                header: () => (
                                    <ScreenHeader headerName="Balance Connect" />
                                ),
                                statusBarStyle: "dark",
                            }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </SafeAreaProvider>
            </RootSiblingParent>
        </ThemeProvider>
    );
}
