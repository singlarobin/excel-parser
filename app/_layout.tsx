import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import { Alert, AppState, AppStateStatus, Linking } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import "react-native-reanimated";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { useColorScheme } from "@/hooks/useColorScheme";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { loadLocalStorageData } from "@/utils/helperFunction";
import { parsedDataKey } from "@/screens/CustomerData/constant";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const pathName = usePathname();

    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        void fetchData();

        const appStateSubscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                async (response) => {
                    await fetchData();

                    const phoneNumber =
                        response.notification.request.content.data.phone;
                    if (phoneNumber) {
                        dialPhone(phoneNumber);
                    }
                }
            );

        return () => {
            appStateSubscription.remove();
            subscription.remove();
            setIsReady(false);
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        // if (nextAppState === "active") {
        //     void fetchData();
        //     // Add your foreground logic here
        // } else {
        //     setIsReady(false);
        // }
    };

    const dialPhone = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert(
                        "Error",
                        `This device cannot open the dialer. Please call manually: ${phoneNumber}`
                    );
                }
            })
            .catch((error) => console.error("Error opening dialer:", error));
    };

    const fetchData = async () => {
        const storedData = await loadLocalStorageData(parsedDataKey);

        if (!_isNil(storedData) && !_isEmpty(storedData)) {
            router.replace("/CustomerListRoute");
        }
    };

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <RootSiblingParent>
                <SafeAreaProvider>
                    <Stack>
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
                        <Stack.Screen
                            name="UserManualRoute"
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
