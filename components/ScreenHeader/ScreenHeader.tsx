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

import { styles } from "./ScreenHeader.styled";

import { useUpdateNotification } from "@/screens/CustomerData/hooks/useUpdateNotification";
import { ScheduleReminder } from "./components/ScheduleReminder/ScheduleReminder";

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
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [reminderType, setReminderType] = useState<string>();

    const handleModalItemClick = (type: string) => {
        setModalVisible(false);
        if (type === "uploadFile") {
            router.push("/");
        } else if (type === "scheduleReminder") {
            setScheduleModalVisible(true);
            setReminderType("schedule");
        } else if (type === "cancelReminder") {
            setScheduleModalVisible(true);
            setReminderType("cancel");
        } else if (type === "openUserManual") {
            router.push("/UserManualRoute");
        }
    };

    const isHomePath = pathName === "/";

    const closeModal = () => {
        setScheduleModalVisible(false);
        setReminderType(undefined);
    };

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
                                    <View>
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
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleModalItemClick(
                                                    "cancelReminder"
                                                )
                                            }
                                        >
                                            <Text style={styles.menuItem}>
                                                Cancel Reminder
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
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

                    <ScheduleReminder
                        isVisible={scheduleModalVisible}
                        closeModal={closeModal}
                        reminderType={reminderType}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default ScreenHeader;
