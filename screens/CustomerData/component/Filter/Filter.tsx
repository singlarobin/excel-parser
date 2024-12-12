import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { styles } from "./Filter.styled";
import { formatDate } from "@/utils/helperFunction";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { Ionicons } from "@expo/vector-icons";

type FilterProps = {
    searchValue: string;
    searchKey: string;
    handleSearch: (text: string) => void;
    selectedDate: string;
    onDayPress: (day: DateData | string) => void;
    mappedData: Record<string, boolean>;
    setSearchKey: (key: string) => void;
};

export const Filter = ({
    searchValue,
    searchKey,
    handleSearch,
    selectedDate,
    onDayPress,
    mappedData,
    setSearchKey,
}: FilterProps) => {
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState({
        label: "Name",
        value: "name",
    });
    const [searchKeyList, setSearchKeyList] = useState<
        Array<Record<string, string>>
    >([]);

    const {
        hasDateMapped,
        hasNameMapped,
        hasCategoryMapped,
        hasTourMapped,
        hasGurrantorMapped,
    } = mappedData;

    useEffect(() => {
        const list: Array<Record<string, string>> = [];
        if (hasNameMapped) {
            list.push({
                label: "Name",
                value: "name",
            });
        }
        if (hasCategoryMapped) {
            list.push({
                label: "Category",
                value: "category",
            });
        }
        if (hasTourMapped) {
            list.push({
                label: "Tour",
                value: "tour",
            });
        }

        if (hasGurrantorMapped) {
            list.push({
                label: "Gurrantor",
                value: "plumber",
            });
        }

        setSearchKeyList(list);
    }, [JSON.stringify(mappedData)]);

    const handleDayPress = (day: DateData) => {
        onDayPress(day);
        // setCalendarVisible(false); // Hide the calendar when a date is selected
    };

    const dateToShow =
        !_isNil(selectedDate) && !_isEmpty(selectedDate)
            ? formatDate(selectedDate)
            : "";

    return (
        <View style={[styles.filterContainer]}>
            <View style={[styles.container]}>
                {(hasNameMapped ||
                    hasCategoryMapped ||
                    hasTourMapped ||
                    hasGurrantorMapped) && (
                    <View style={[styles.searchBox]}>
                        <TextInput
                            placeholder={"Search By"}
                            style={[styles.searchText]}
                            autoFocus={false}
                            autoCapitalize={"none"}
                            value={searchValue}
                            onChangeText={handleSearch}
                        />
                        <Dropdown
                            list={searchKeyList}
                            selectedItem={selectedValue}
                            onChange={(value) => {
                                setSearchKey(value.value);
                                setSelectedValue(value);
                            }}
                            dropdownStyles={styles.dropdown}
                        />
                    </View>
                )}
                {/* {(hasNameMapped ||
                hasCategoryMapped ||
                hasTourMapped ||
                hasGurrantorMapped) && (
               
            )} */}
                {hasDateMapped && (
                    <TouchableOpacity
                        style={[styles.dateContainer]}
                        activeOpacity={1}
                        onPress={() => setCalendarVisible(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={"gray"}
                        />
                    </TouchableOpacity>
                )}
                <Modal
                    visible={isCalendarVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setCalendarVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalBackground}
                        onPress={() => setCalendarVisible(false)}
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
                    </TouchableOpacity>
                </Modal>
            </View>
            {!_isEmpty(dateToShow) && (
                <View style={[styles.chip]}>
                    <Text style={[styles.chipBoldText]}>Selected Date :</Text>
                    <Text> {dateToShow}</Text>
                </View>
            )}
        </View>
    );
};
