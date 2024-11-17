import { useEffect, useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { formatDate, formatIsoDate } from "@/utils/helperFunction";
import { styles } from "./DetailUpdate.styled";

type DetailUpdateProps = {
    data: Record<string, any>;
    updateData: (data: Record<string, any>) => void;
};

export const DetailUpdate = ({ data, updateData }: DetailUpdateProps) => {
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>();

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    useEffect(() => {
        setSelectedDate(formatIsoDate(data["dueDate"], false));
    }, [data["dueDate"]]);

    const handleClose = () => {
        updateData({
            ...data,
            dueDate:
                !_isNil(selectedDate) && !_isEmpty(selectedDate)
                    ? new Date(selectedDate).toISOString()
                    : "",
        });
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
                                ? formatDate(selectedDate)
                                : "Select Date"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={isCalendarVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setCalendarVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setCalendarVisible(false)}
                        style={styles.modalBackground}
                    >
                        <View style={styles.calendarContainer}>
                            <Calendar
                                onDayPress={handleDayPress}
                                markedDates={
                                    selectedDate
                                        ? {
                                              [selectedDate]: {
                                                  selected: true,
                                                  selectedColor: "blue",
                                              },
                                          }
                                        : {}
                                }
                            />
                            <View style={[styles.btnContainer]}>
                                <TouchableOpacity
                                    style={[styles.button, styles.clearBtn]}
                                    onPress={() => setSelectedDate(undefined)}
                                >
                                    <Text style={styles.buttonText}>Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setCalendarVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={[{ alignItems: "center", marginBottom: 24 }]}>
                <View style={[{ width: "30%" }]}>
                    <Button title="Update" onPress={handleClose} />
                </View>
            </View>
        </View>
    );
};
