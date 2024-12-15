import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { formatIsoDate } from "@/utils/helperFunction";
import { styles } from "./DetailUpdate.styled";

type DetailUpdateProps = {
    data: Record<string, any>;
    updateData: (
        data: Record<string, any>,
        time?: { hour: number; minute: number }
    ) => Promise<void>;
};

export const DetailUpdate = ({ data, updateData }: DetailUpdateProps) => {
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>();
    const [time, setTime] = useState<
        { hour: number; minute: number } | undefined
    >({
        hour: 0,
        minute: 0,
    });

    useEffect(() => {
        const currentDate = new Date();
        setTime({
            hour: currentDate.getHours(),
            minute: currentDate.getMinutes(),
        });
    }, []);

    const handleDayPress = (date: Date) => {
        setSelectedDate(date.toISOString());
        setCalendarVisible(false);
    };

    useEffect(() => {
        setSelectedDate(formatIsoDate(data["dueDate"], false));
    }, [data["dueDate"]]);

    const handleClose = () => {
        updateData(
            {
                ...data,
                dueDate:
                    !_isNil(selectedDate) && !_isEmpty(selectedDate)
                        ? new Date(selectedDate).toISOString()
                        : "",
            },
            time
        );
    };

    const handleTimeConfirm = (time: any) => {
        const hour = time.getHours();
        const minute = time.getMinutes();

        setTime({
            hour: hour,
            minute: minute,
        });
        setIsTimePickerVisible(false);
    };

    const handleClear = () => {
        setTime(undefined);
        setSelectedDate(undefined);
    };

    return (
        <View style={[styles.container]}>
            <View style={[{ flex: 1 }]}>
                <View
                    style={[
                        { flexDirection: "row", gap: 12, alignItems: "center" },
                    ]}
                >
                    <Text>Due Date</Text>
                    <TouchableOpacity
                        style={[styles.dateContainer]}
                        activeOpacity={1}
                        onPress={() => setCalendarVisible(true)}
                    >
                        <Text>
                            {!_isNil(selectedDate) && !_isEmpty(selectedDate)
                                ? formatIsoDate(selectedDate)
                                : "Select Date"}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isCalendarVisible}
                        mode="date"
                        date={
                            selectedDate ? new Date(selectedDate) : new Date()
                        }
                        onConfirm={handleDayPress}
                        onCancel={() => setCalendarVisible(false)}
                    />
                </View>

                <View
                    style={[
                        { flexDirection: "row", gap: 12, alignItems: "center" },
                    ]}
                >
                    <Text>Select Time</Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.dateContainer]}
                        onPress={() => setIsTimePickerVisible(true)}
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

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeConfirm}
                    onCancel={() => setIsTimePickerVisible(false)}
                />

                <View style={[styles.btnContainer]}>
                    <TouchableOpacity
                        style={[styles.button, styles.clearBtn]}
                        onPress={handleClear}
                    >
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[{ alignItems: "center", marginBottom: 24 }]}>
                <View style={[{ width: "30%" }]}>
                    <Button title="Update" onPress={handleClose} />
                </View>
            </View>
        </View>
    );
};
