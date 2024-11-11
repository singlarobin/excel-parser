import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { styles } from "./Filter.styled";
import { formatDate } from "@/utils/helperFunction";

type FilterProps = {
    searchValue: string;
    handleSearch: (text: string) => void;
    selectedDate: string;
    onDayPress: (day: DateData | string) => void;
};

export const Filter = ({
    searchValue,
    handleSearch,
    selectedDate,
    onDayPress,
}: FilterProps) => {
    const [isCalendarVisible, setCalendarVisible] = useState(false);

    const handleDayPress = (day: DateData) => {
        onDayPress(day);
        // setCalendarVisible(false); // Hide the calendar when a date is selected
    };

    const dateToShow =
        !_isNil(selectedDate) && !_isEmpty(selectedDate)
            ? formatDate(selectedDate)
            : "";

    return (
        <View style={[styles.container]}>
            <TextInput
                placeholder={"Search By Name"}
                style={[styles.searchBox]}
                autoFocus={false}
                autoCapitalize={"none"}
                value={searchValue}
                onChangeText={handleSearch}
            />
            <TouchableOpacity
                style={[styles.dateContainer]}
                activeOpacity={1}
                onPress={() => setCalendarVisible(true)}
            >
                <Text>{dateToShow || "Select Date"}</Text>
            </TouchableOpacity>
            <Modal
                visible={isCalendarVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCalendarVisible(false)}
            >
                <View style={styles.modalBackground}>
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
                                onPress={() => onDayPress("")}
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
                </View>
            </Modal>
        </View>
    );
};
