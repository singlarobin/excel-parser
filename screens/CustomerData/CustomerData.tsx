import { View, FlatList, Text, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { DateData } from "react-native-calendars";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";

import { styles } from "./CustomerData.styled";
import { useEffect, useState } from "react";
import { Card } from "./component/card/card";
import {
    loadLocalStorageData,
    formatDate,
    formatIsoDate,
} from "@/utils/helperFunction";
import { parsedDataKey } from "./constant";
import { Filter } from "./component/Filter/Filter";

export const CustomerListScreen = () => {
    const [fileData, setFileData] = useState<Array<Record<string, any>>>([]);
    const [filteredData, setFilteredData] = useState<
        Array<Record<string, any>>
    >([]);

    const [searchValue, setSearchValue] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setFilteredData(fileData);
    }, [JSON.stringify(fileData)]);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true; // Prevent default behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const fetchData = async () => {
        const storedData = await loadLocalStorageData(parsedDataKey);
        if (storedData) {
            setFileData(storedData);
        }
    };

    const handleListFiltering = (type: string, value: any) => {
        const searchTerm = type === "search" ? value : searchValue;
        const dueDate = type === "dueDate" ? value : selectedDate;

        const filteredData = fileData?.filter((obj) => {
            const matchesSearch = searchTerm
                ? (obj["name"] ?? "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true;

            const currentDueDate =
                !_isNil(obj["dueDate"]) && !_isEmpty(obj["dueDate"])
                    ? formatIsoDate(obj["dueDate"])
                    : "";

            const matchesDueDate = dueDate
                ? currentDueDate === formatDate(dueDate)
                : true;

            return matchesSearch && matchesDueDate;
        });

        setFilteredData(filteredData);
    };

    const debounceListFiltering = debounce(
        (type, value) => handleListFiltering(type, value),
        500
    );

    const handleSearch = (text: string) => {
        setSearchValue(text);

        debounceListFiltering("search", text);
    };

    const onDayPress = (day: DateData | string) => {
        let dateString = "";

        if (typeof day === "object") {
            dateString = day.dateString;
        }

        setSelectedDate(dateString);
        debounceListFiltering("dueDate", dateString);
    };

    return (
        <SafeAreaView style={[styles.container]}>
            {(_isNil(fileData) || _isEmpty(fileData)) && (
                <View style={[styles.emptyDataContainer]}>
                    <Text>No Data</Text>
                </View>
            )}

            {!_isNil(fileData) && !_isEmpty(fileData) && (
                <View style={styles.dataContainer}>
                    <View>
                        <Filter
                            searchValue={searchValue}
                            handleSearch={handleSearch}
                            selectedDate={selectedDate}
                            onDayPress={onDayPress}
                        />
                    </View>

                    {
                        <FlatList
                            contentContainerStyle={styles.listContainer}
                            data={filteredData}
                            ItemSeparatorComponent={() => (
                                <View style={styles.horizontalLine} />
                            )}
                            keyExtractor={(item, index) =>
                                item.id ?? String(index)
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <Card key={item?.id ?? index} data={item} />
                                );
                            }}
                        />
                    }
                </View>
            )}
        </SafeAreaView>
    );
};
