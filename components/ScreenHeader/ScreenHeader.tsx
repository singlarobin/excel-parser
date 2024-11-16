import {
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useState } from "react";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
    loadLocalStorageData,
    saveLocalStorageData,
} from "@/utils/helperFunction";
import { parsedDataKey } from "@/screens/CustomerData/constant";

import { styles } from "./ScreenHeader.styled";
import Toast from "react-native-root-toast";

type ScreenHeaderProps = {
    cartCount?: number;
    headerName?: string;
    header?: React.ReactElement;
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const ScreenHeader = ({ headerName, header }: ScreenHeaderProps) => {
    const pathName = usePathname();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);

    async function requestPermissions() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("You need to enable permissions for notifications to work!");
        } else {
            const storedData: any[] = await loadLocalStorageData(parsedDataKey);
            if (!_isNil(storedData) && !_isEmpty(storedData)) {
                storedData.forEach((obj) => {
                    if (!_isNil(obj["dueDate"]) && !_isEmpty(obj["dueDate"])) {
                        scheduleReminder(obj);
                    }
                });

                Toast.show("Reminder scheduled for all users");
            }
        }
    }

    async function scheduleReminder(obj: Record<string, any>) {
        const { name, phone, balance, dueDate } = obj;
        // Combine date and time into a single Date object
        const reminderDate = new Date(dueDate);
        // const [hours, minutes] = time.split(":").map(Number);
        reminderDate.setHours(15, 8);

        let body = "This is your scheduled reminder!";

        if (!_isNil(name) && !_isEmpty(name)) {
            body = `Connect with ${name}`;

            if (!_isNil(balance)) {
                body += ` for the pending amount: ${balance}`;
            }
        }

        // Schedule notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Balance Connect",
                body,
                data: obj,
                priority: "high", // Set priority for visibility
            },
            trigger: reminderDate,
        });
    }

    const handleModalItemClick = (type: string) => {
        setModalVisible(false);
        if (type === "uploadFile") {
            // saveLocalStorageData([], parsedDataKey);
            router.push("/");
        } else if (type === "scheduleReminder") {
            requestPermissions();
        }
    };

    const isHomePath = pathName === "/";

    return (
        <SafeAreaView>
            {!_isNil(header) ? (
                header
            ) : (
                <View style={[styles.container]}>
                    <Text style={[styles.headerText]}>
                        {headerName ?? pathName.split("/")[1]}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons
                            name="menu-outline"
                            color={"white"}
                            size={30}
                        />
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType="none"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity
                            style={[styles.overlay]}
                            onPress={() => setModalVisible(false)}
                        >
                            <View style={styles.menu}>
                                {!isHomePath && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleModalItemClick("uploadFile")
                                        }
                                    >
                                        <Text style={styles.menuItem}>
                                            Upload New File
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {!isHomePath && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleModalItemClick(
                                                "scheduleReminder"
                                            )
                                        }
                                    >
                                        <Text style={styles.menuItem}>
                                            Schedule Reminder
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() =>
                                        handleModalItemClick("openUserManual")
                                    }
                                >
                                    <Text style={styles.menuItem}>
                                        User Manual
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            )}
        </SafeAreaView>
    );
};

export default ScreenHeader;
