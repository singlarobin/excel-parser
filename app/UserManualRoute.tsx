import { Colors } from "@/constants/Colors";
import { Href, useRootNavigationState, useRouter } from "expo-router";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";

export default function UserManual() {
    const state = useRootNavigationState();
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            if (
                !_isNil(state.routes) &&
                !_isEmpty(state.routes) &&
                state.routes.length >= 2
            ) {
                const lastRoute = state.routes[state.routes.length - 2];

                const name = `/${
                    lastRoute.name === "index" ? "" : lastRoute.name
                }`;

                router.push(name as Href<string>);
            } else {
                BackHandler.exitApp();
            }

            return true; // Prevent default behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Features Supported</Text>
            <View style={styles.listItem}>
                <Text>
                    - Upload excel file having user data (format supported -
                    xlsx, xls).
                </Text>
                <Text>
                    - Select worksheet and then map its column with the fields
                    present and then continue.
                </Text>
                <Text>
                    - All the user data is visible. You can filter the list with
                    name and due date field (if mapped).
                </Text>
                <Text>
                    - You can schedule notifications for all the users based on
                    their due date (if mapped) by opening menu from top-right
                    corner.
                </Text>
                <Text>
                    - Click on phone icon to call the user to remind their
                    balance.
                </Text>
                <Text>
                    - Click on edit icon to change the due date for balance.
                    (Notification will be scheduled for the new date
                    automatically).
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.neutral.white,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    heading: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    listItem: {
        gap: 4,
        paddingLeft: 8,
    },
});
