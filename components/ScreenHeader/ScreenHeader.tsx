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

import {
    getDataToScheduleReminder,
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
        shouldSetBadge: false,
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
                const pArr = storedData.map((obj) => {
                    return new Promise(async (resolve) => {
                        if (
                            !_isNil(obj["dueDate"]) &&
                            !_isEmpty(obj["dueDate"])
                        ) {
                            const notififcationId = await scheduleReminder(obj);
                            resolve({
                                ...obj,
                                notififcationId,
                            });
                        }

                        resolve(obj);
                    });
                });

                Promise.all(pArr).then((values) => {
                    saveLocalStorageData(values ?? [], parsedDataKey);

                    Toast.show("Reminder scheduled for all users");
                });
            }
        }
    }

    async function scheduleReminder(obj: Record<string, any>) {
        const notificationContent = getDataToScheduleReminder(obj);
        // Schedule notification
        const id = await Notifications.scheduleNotificationAsync(
            notificationContent
        );

        return id;
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
                            activeOpacity={1}
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
