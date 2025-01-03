import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { styles } from "./Filter.styled";
import { formatIsoDate, loadLocalStorageData } from "@/utils/helperFunction";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { Ionicons } from "@expo/vector-icons";
import { mappedColumnKeysList, searchAllowedKeys } from "../../constant";
import { mapToFieldObj } from "@/screens/Home/constant";

type FilterProps = {
    searchValue: string;
    searchKey: string;
    handleSearch: (text: string) => void;
    selectedDate: string;
    handleDateSelect: (date: string) => void;
    setSearchKey: (key: string) => void;
};

export const Filter = ({
    searchValue,
    searchKey,
    handleSearch,
    selectedDate,
    handleDateSelect,
    setSearchKey,
}: FilterProps) => {
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<Record<string, string>>({
        label: mapToFieldObj[searchKey],
        value: searchKey,
    });
    const [searchKeyList, setSearchKeyList] = useState<
        Array<Record<string, string>>
    >([]);

    const [mappedKeysList, setMappedKeysList] = useState<string[]>([]);

    useEffect(() => {
        void generateSearchKeyList();
    }, []);

    const generateSearchKeyList = async () => {
        const keysList: string[] = await loadLocalStorageData(
            mappedColumnKeysList
        );

        setMappedKeysList(keysList);

        if (!_isNil(keysList) && !_isEmpty(keysList)) {
            const list: Array<Record<string, string>> = [];
            searchAllowedKeys.forEach((key) => {
                if (keysList.includes(key)) {
                    list.push({
                        label: mapToFieldObj[key],
                        value: key,
                    });

                    // if (_isNil(selectedValue)) {
                    //     setSelectedValue({
                    //         label: mapToFieldObj[key],
                    //         value: key,
                    //     });
                    // }
                }
            });
            setSearchKeyList(list);
        }
    };

    const handleDayPress = (date: Date) => {
        handleDateSelect(date.toISOString());
        setCalendarVisible(false); // Hide the calendar when a date is selected
    };

    const dateToShow =
        !_isNil(selectedDate) && !_isEmpty(selectedDate)
            ? formatIsoDate(selectedDate)
            : "";

    const showSearch = searchKeyList.some((obj) =>
        searchAllowedKeys.includes(obj.value)
    );

    const showCalender = mappedKeysList.some((key) => key === "dueDate");

    return (
        <View style={[styles.filterContainer]}>
            <View style={[styles.container]}>
                {showSearch && (
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

                {showCalender && (
                    <TouchableOpacity
                        style={[styles.dateContainer]}
                        activeOpacity={0.5}
                        onPress={() => setCalendarVisible(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={"gray"}
                        />
                    </TouchableOpacity>
                )}

                <DateTimePickerModal
                    isVisible={isCalendarVisible}
                    mode="date"
                    date={selectedDate ? new Date(selectedDate) : new Date()}
                    onConfirm={handleDayPress}
                    onCancel={() => setCalendarVisible(false)}
                />
            </View>
            {!_isEmpty(dateToShow) && (
                <View style={[styles.chip]}>
                    <Text style={[styles.chipBoldText]}>Selected Date :</Text>
                    <Text> {dateToShow}</Text>

                    <TouchableOpacity
                        style={[styles.closeIcon]}
                        activeOpacity={0.5}
                        onPress={() => handleDateSelect("")}
                    >
                        <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color={"gray"}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
