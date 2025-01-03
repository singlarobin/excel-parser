import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import * as Notifications from "expo-notifications";

import { styles } from "./ScheduleReminder.styled";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useUpdateNotification } from "@/screens/CustomerData/hooks/useUpdateNotification";

import { parsedDataKey, scheduleDelay } from "@/screens/CustomerData/constant";
import {
    loadLocalStorageData,
    saveLocalStorageData,
} from "@/utils/helperFunction";
import Toast from "react-native-root-toast";

type ScheduleReminderProps = {
    isVisible: boolean;
    reminderType?: string;
    closeModal: () => void;
};

export const ScheduleReminder = ({
    isVisible,
    reminderType,
    closeModal,
}: ScheduleReminderProps) => {
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [time, setTime] = useState<
        { hour: number; minute: number } | undefined
    >({
        hour: 0,
        minute: 0,
    });

    const { updateNotificationReminder, cancelNotification } =
        useUpdateNotification();

    useEffect(() => {
        const currentDate = new Date();
        setTime({
            hour: currentDate.getHours(),
            minute: currentDate.getMinutes(),
        });
    }, []);

    const handleTimeConfirm = (time: any) => {
        const hour = time.getHours();
        const minute = time.getMinutes();

        setTime({
            hour: hour,
            minute: minute,
        });
        setIsTimePickerVisible(false);
    };

    async function requestPermissions() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("You need to enable permissions for notifications to work!");
            closeModal();
        } else {
            try {
                const storedData: any[] = await loadLocalStorageData(
                    parsedDataKey
                );

                const globaldelay = await loadLocalStorageData(scheduleDelay);

                if (!_isNil(storedData) && !_isEmpty(storedData)) {
                    setIsScheduling(true);

                    // Define batch size and delay
                    const batchSize = 30; // Number of notifications per batch
                    const delay = 1500 + (globaldelay ?? 0); // Delay in milliseconds between batches

                    // Function to process a single batch
                    const processBatch = async (batch: any[]) => {
                        const pArr = batch.map((obj) => {
                            return new Promise(async (resolve, reject) => {
                                if (
                                    !_isNil(obj.notificationId) &&
                                    !_isEmpty(obj.notificationId)
                                ) {
                                    await cancelNotification(
                                        obj.notificationId
                                    );
                                }

                                if (
                                    !_isNil(obj["dueDate"]) &&
                                    !_isEmpty(obj["dueDate"])
                                ) {
                                    try {
                                        const notificationId =
                                            await updateNotificationReminder(
                                                obj,
                                                time
                                            );
                                        resolve({ ...obj, notificationId });
                                    } catch (err) {
                                        if (err instanceof Error) {
                                            console.log(
                                                "error scheduling reminder: ",
                                                err.message
                                            );
                                        }
                                        reject(obj);
                                    }
                                } else {
                                    resolve(obj);
                                }
                            });
                        });

                        const response = await Promise.allSettled(pArr);
                        let allResolved = true;

                        const results = response.map((result) => {
                            if (result.status === "fulfilled") {
                                return result.value;
                            } else {
                                allResolved = false;
                                return result.reason;
                            }
                        });

                        return { allResolved, results };
                    };

                    let updatedStoredData: any[] = [];

                    let allScheduled = true;

                    // Split the data into batches
                    for (let i = 0; i < storedData.length; i += batchSize) {
                        const batch = storedData.slice(i, i + batchSize);

                        // Process the current batch
                        const { allResolved, results: updatedBatch } =
                            await processBatch(batch);

                        updatedStoredData = [
                            ...updatedStoredData,
                            ...updatedBatch,
                        ];

                        if (!allResolved) {
                            allScheduled = false;
                        }

                        // Save the updated data to local storage after each batch

                        // Add delay before processing the next batch
                        if (i + batchSize < storedData.length) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, delay)
                            );
                        }
                    }

                    await saveLocalStorageData(
                        updatedStoredData,
                        parsedDataKey
                    );
                    if (allScheduled) {
                        Toast.show("Reminder scheduled for all users");

                        await saveLocalStorageData(0, scheduleDelay);
                    } else {
                        Toast.show(
                            "Some error occurred while scheduling all reminders, please try again!!"
                        );

                        await saveLocalStorageData(
                            (globaldelay ?? 0) + 500,
                            scheduleDelay
                        );
                    }
                    setIsScheduling(false);
                    closeModal();
                }
            } catch (err) {
                if (err instanceof Error) {
                    Toast.show(err.message);
                }
            }
        }
    }

    const cancelAllReminders = async () => {
        const storedData: any[] = await loadLocalStorageData(parsedDataKey);
        if (!_isNil(storedData) && !_isEmpty(storedData)) {
            setIsScheduling(true);

            const pArr = storedData.map((obj) => {
                return new Promise(async (resolve) => {
                    if (
                        !_isNil(obj.notificationId) &&
                        !_isEmpty(obj.notificationId)
                    ) {
                        await cancelNotification(obj.notificationId);

                        resolve({
                            ...obj,
                            notificationId: null,
                        });
                    } else {
                        resolve(obj);
                    }
                });
            });

            Promise.all(pArr).then((values) => {
                saveLocalStorageData(values ?? [], parsedDataKey);

                Toast.show("Reminder cancelled for all users");
                setIsScheduling(false);
                closeModal();
            });
        }
    };

    const menuStyle = () => {
        if (reminderType === "schedule") {
            return {
                transform: [{ translateX: -130 }, { translateY: -200 }],
                width: 260,
                height: 400,
            };
        }

        return {
            transform: [{ translateX: -130 }, { translateY: -100 }],
            width: 260,
            height: 200,
        };
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
            onRequestClose={closeModal}
        >
            <View style={[styles.overlay]}>
                <View style={[styles.menu, menuStyle()]}>
                    <TouchableOpacity
                        style={[styles.closeIcon]}
                        activeOpacity={0.5}
                        onPress={closeModal}
                    >
                        <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color={"gray"}
                        />
                    </TouchableOpacity>
                    <View style={[{ flex: 1 }]}>
                        {reminderType === "schedule" && (
                            <View>
                                <Text>
                                    Reminder will be schedule for the customers
                                    with below specified time on their due date
                                </Text>
                                <View
                                    style={[
                                        {
                                            flexDirection: "row",
                                            gap: 12,
                                            alignItems: "center",
                                        },
                                    ]}
                                >
                                    <Text>Select Time</Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[styles.dateContainer]}
                                        onPress={() =>
                                            setIsTimePickerVisible(true)
                                        }
                                    >
                                        <Text>
                                            {`${
                                                !_isNil(time)
                                                    ? `${time.hour}:${time.minute}`
                                                    : "-"
                                            }`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {reminderType === "cancel" && (
                            <View>
                                <Text>
                                    This will cancel all the scheduled
                                    reminders. Are you sure you to proceed ?
                                </Text>
                            </View>
                        )}
                    </View>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={() => setIsTimePickerVisible(false)}
                    />

                    <View>
                        {isScheduling ? (
                            <ActivityIndicator
                                size={"large"}
                                color={Colors.neutral.blue}
                            />
                        ) : (
                            <Button
                                title={
                                    reminderType === "schedule"
                                        ? "Schedule"
                                        : "Cancel"
                                }
                                color={Colors.neutral.blue}
                                onPress={() => {
                                    if (reminderType === "schedule") {
                                        requestPermissions();
                                    } else if (reminderType === "cancel") {
                                        cancelAllReminders();
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};
