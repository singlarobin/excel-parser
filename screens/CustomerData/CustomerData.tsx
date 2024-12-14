import {
    View,
    FlatList,
    Text,
    BackHandler,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Notifications from "expo-notifications";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";

import { styles } from "./CustomerData.styled";
import { useCallback, useEffect, useState } from "react";
import { Card } from "./component/card/card";
import {
    loadLocalStorageData,
    formatIsoDate,
    saveLocalStorageData,
    getDataToScheduleReminder,
} from "@/utils/helperFunction";
import {
    mappedColumnKeysList,
    parsedDataKey,
    searchAllowedKeys,
} from "./constant";
import { Filter } from "./component/Filter/Filter";
import { DetailUpdate } from "./component/DetailUpdate/DetailUpdate";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "expo-router";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const CustomerListScreen = () => {
    const [fileData, setFileData] = useState<Array<Record<string, any>>>([]);
    const [filteredData, setFilteredData] = useState<
        Array<Record<string, any>>
    >([]);

    const [isLoading, setIsLoading] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [customerDetailIndex, setCustomerDetailIndex] = useState<number>();

    useFocusEffect(
        useCallback(() => {
            fetchData();

            setSearchValue("");
            setSearchKey("name");
            setSelectedDate("");
        }, [])
    );

    // useEffect(() => {
    //     setFilteredData(fileData);
    // }, [JSON.stringify(fileData)]);

    useEffect(() => {
        return () => {
            setSearchValue("");
            setSearchKey("name");
            setSelectedDate("");
        };
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (!_isNil(customerDetailIndex)) {
                setCustomerDetailIndex(undefined);
            } else {
                BackHandler.exitApp();
            }

            return true; // Prevent default behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [customerDetailIndex]);

    const fetchData = async () => {
        setIsLoading(true);
        const storedData = await loadLocalStorageData(parsedDataKey);
        const keysList: string[] = await loadLocalStorageData(
            mappedColumnKeysList
        );

        setIsLoading(false);
        if (storedData) {
            setFileData(storedData);

            // let updatedStoredData = [...storedData];

            // if (!_isNil(searchValue) && !_isEmpty(searchValue)) {
            //     updatedStoredData = updatedStoredData.filter((data) =>
            //         (data[searchKey] ?? "")
            //             .toLowerCase()
            //             .includes(searchValue.toLowerCase())
            //     );
            //     console.log("====> search", searchValue, updatedStoredData);
            // }

            // if (!_isNil(selectedDate) && !_isEmpty(selectedDate)) {
            //     updatedStoredData = updatedStoredData.filter((data) => {
            //         const currentDueDate =
            //             !_isNil(data["dueDate"]) && !_isEmpty(data["dueDate"])
            //                 ? formatIsoDate(data["dueDate"])
            //                 : "";

            //         return currentDueDate === formatDate(selectedDate);
            //     });
            //     console.log(
            //         "====> selectedDate",
            //         selectedDate,
            //         updatedStoredData
            //     );
            // }

            setFilteredData(storedData);
        }

        if (!_isNil(keysList) && !_isEmpty(keysList)) {
            for (let i = 0; i < searchAllowedKeys.length; i++) {
                if (keysList.includes(searchAllowedKeys[i])) {
                    setSearchKey(searchAllowedKeys[i]);
                    break;
                }
            }
        }
    };

    const handleListFiltering = (type: string, value: any) => {
        const searchTerm = type === "search" ? value : searchValue;
        const dueDate = type === "dueDate" ? value : selectedDate;

        const filteredData = fileData?.filter((obj, index) => {
            const objSearchValue =
                typeof obj[searchKey] === "string"
                    ? obj[searchKey]
                    : `${obj[searchKey]}`;

            const matchesSearch = searchTerm
                ? objSearchValue
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true;

            const currentDueDate =
                !_isNil(obj["dueDate"]) && !_isEmpty(obj["dueDate"])
                    ? formatIsoDate(obj["dueDate"])
                    : "";

            const matchesDueDate = dueDate
                ? currentDueDate === formatIsoDate(dueDate)
                : true;

            return matchesSearch && matchesDueDate;
        });

        setFilteredData(filteredData);
    };

    const debounceListFiltering = useCallback(
        debounce((type, value) => {
            handleListFiltering(type, value);
        }, 500),
        [JSON.stringify(fileData)]
    );

    const handleSearch = (text: string) => {
        setSearchValue(text);

        debounceListFiltering("search", text);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        debounceListFiltering("dueDate", date);
    };

    const cancelNotification = async (notificationId: string) => {
        if (!_isEmpty(notificationId)) {
            await Notifications.cancelScheduledNotificationAsync(
                notificationId
            );
            console.log("Notification Cancelled:", notificationId);
        } else {
            console.log("No notification to cancel.");
        }
    };

    const updateNotificationReminder = async (data: Record<string, any>) => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("You need to enable permissions for notifications to work!");
        } else {
            const { notificationId } = data;

            await cancelNotification(notificationId);

            const notificationContent = getDataToScheduleReminder(data);
            const id = await Notifications.scheduleNotificationAsync(
                notificationContent
            );

            return id;
        }

        return "";
    };

    const updateFileData = async (data: Record<string, any>) => {
        const notificationId = await updateNotificationReminder(data);

        const updatedFileData = fileData.map((obj, index) => {
            if (customerDetailIndex === index) {
                return {
                    ...data,
                    notificationId,
                    isUpdated: true,
                };
            }

            return obj;
        });

        const updatedFilterData = filteredData.map((obj, index) => {
            if (customerDetailIndex === index) {
                return {
                    ...data,
                    notificationId,
                    isUpdated: true,
                };
            }

            return obj;
        });

        (updatedFilterData ?? []).sort((a, b) => {
            const dateA = new Date(a["dueDate"]);
            const dateB = new Date(b["dueDate"]);

            return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0); // Ascending order
        });

        (updatedFileData ?? []).sort((a, b) => {
            const dateA = new Date(a["dueDate"]);
            const dateB = new Date(b["dueDate"]);

            return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0); // Ascending order
        });

        setFileData(updatedFileData);
        setFilteredData(updatedFilterData);

        saveLocalStorageData(updatedFileData ?? [], parsedDataKey);

        setCustomerDetailIndex(undefined);
    };

    if (!_isNil(customerDetailIndex)) {
        return (
            <DetailUpdate
                data={fileData[customerDetailIndex]}
                updateData={updateFileData}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.container]}>
            {(_isNil(fileData) || _isEmpty(fileData)) && (
                <View style={[styles.emptyDataContainer]}>
                    {isLoading ? (
                        <ActivityIndicator
                            size={"large"}
                            color={Colors.neutral.blue}
                        />
                    ) : (
                        <Text>No Data</Text>
                    )}
                </View>
            )}

            {!_isNil(fileData) && !_isEmpty(fileData) && (
                <View style={styles.dataContainer}>
                    <View>
                        <Filter
                            searchValue={searchValue}
                            searchKey={searchKey}
                            handleSearch={handleSearch}
                            selectedDate={selectedDate}
                            handleDateSelect={handleDateSelect}
                            setSearchKey={setSearchKey}
                        />
                    </View>

                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={filteredData}
                        ItemSeparatorComponent={() => (
                            <View style={styles.horizontalLine} />
                        )}
                        keyExtractor={(item, index) =>
                            item?.id ?? String(index)
                        }
                        ListEmptyComponent={
                            <View style={[styles.emptyDataContainer]}>
                                <Text>No Data</Text>
                            </View>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <Card
                                    key={item?.id ?? index}
                                    data={item}
                                    index={index}
                                    setCustomerDetailIndex={
                                        setCustomerDetailIndex
                                    }
                                />
                            );
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};
