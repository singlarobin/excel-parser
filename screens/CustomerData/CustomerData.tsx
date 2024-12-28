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
} from "@/utils/helperFunction";
import {
    mappedColumnKeysList,
    parsedDataKey,
    searchAllowedKeys,
} from "./constant";
import { Filter } from "./component/Filter/Filter";
import { DetailUpdate } from "./component/DetailUpdate/DetailUpdate";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useUpdateNotification } from "./hooks/useUpdateNotification";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const CustomerListScreen = () => {
    const router = useRouter();
    const { filter } = useLocalSearchParams();

    const [fileData, setFileData] = useState<Array<Record<string, any>>>([]);
    const [filteredData, setFilteredData] = useState<
        Array<Record<string, any>>
    >([]);

    const [isLoading, setIsLoading] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [customerDetailId, setCustomerDetailId] = useState<string>();

    const { updateNotificationReminder } = useUpdateNotification();

    useFocusEffect(
        useCallback(() => {
            const filterData = filter
                ? JSON.parse(filter as string)
                : {
                      searchKey: "",
                      searchValue: "",
                      selectedDate: "",
                  };

            void fetchData(filterData);

            setSearchKey(filterData?.searchKey ?? "name");
            setSearchValue(filterData?.searchValue ?? "");
            setSelectedDate(filterData?.selectedDate ?? "");
        }, [])
    );

    useEffect(() => {
        return () => {
            setSearchValue("");
            setSearchKey("name");
            setSelectedDate("");
        };
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (!_isNil(customerDetailId)) {
                setCustomerDetailId(undefined);
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
    }, [customerDetailId]);

    const fetchData = async (filterData: Record<string, any>) => {
        setIsLoading(true);
        const storedData = await loadLocalStorageData(parsedDataKey);
        const keysList: string[] = await loadLocalStorageData(
            mappedColumnKeysList
        );

        if (storedData) {
            setFileData(storedData);

            let updatedStoredData = [...storedData];

            const { searchValue, searchKey, selectedDate } = filterData;

            if (!_isNil(searchValue) && !_isEmpty(searchValue)) {
                updatedStoredData = updatedStoredData.filter((data) =>
                    (data[searchKey] ?? "")
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                );
            }

            if (!_isNil(selectedDate) && !_isEmpty(selectedDate)) {
                updatedStoredData = updatedStoredData.filter((data) => {
                    const currentDueDate =
                        !_isNil(data["dueDate"]) && !_isEmpty(data["dueDate"])
                            ? formatIsoDate(data["dueDate"])
                            : "";

                    return currentDueDate === formatIsoDate(selectedDate);
                });
            }

            setFilteredData(updatedStoredData);
        }

        if (!_isNil(keysList) && !_isEmpty(keysList)) {
            for (let i = 0; i < searchAllowedKeys.length; i++) {
                if (keysList.includes(searchAllowedKeys[i])) {
                    setSearchKey(searchAllowedKeys[i]);
                    break;
                }
            }
        }

        setIsLoading(false);
    };

    const handleListFiltering = (
        type: string,
        value: any,
        allData?: Record<string, any>[]
    ) => {
        const searchTerm = type === "search" ? value : searchValue;
        const dueDate = type === "dueDate" ? value : selectedDate;

        const filteredData = (allData ?? fileData)?.filter((obj, index) => {
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

    const debounceListFiltering = debounce((type, value) => {
        handleListFiltering(type, value);
    }, 500);

    const handleSearch = (text: string) => {
        setSearchValue(text);
        debounceListFiltering("search", text);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        debounceListFiltering("dueDate", date);
    };

    const handleCardClick = (id: string) => {
        const filter = JSON.stringify({
            searchKey,
            searchValue,
            selectedDate,
        });

        router.push(`/CustomerDetailsRoute?id=${id}&filter=${filter}`);
    };

    const updateFileData = async (
        data: Record<string, any>,
        time?: { hour: number; minute: number }
    ) => {
        const notificationId = await updateNotificationReminder(data, time);

        const updatedFileData = fileData.map((obj) => {
            if (customerDetailId === obj.id) {
                return {
                    ...data,
                    notificationId,
                    isUpdated: true,
                };
            }

            return obj;
        });

        (updatedFileData ?? []).sort((a, b) => {
            const dateA = new Date(a["dueDate"]);
            const dateB = new Date(b["dueDate"]);

            return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0); // Ascending order
        });

        setFileData(updatedFileData);

        saveLocalStorageData(updatedFileData ?? [], parsedDataKey);

        setCustomerDetailId(undefined);

        handleListFiltering("", "", updatedFileData);
    };

    if (!_isNil(customerDetailId)) {
        const data = fileData.find((obj) => obj.id === customerDetailId);

        if (!_isNil(data)) {
            return <DetailUpdate data={data} updateData={updateFileData} />;
        }
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
                                    setCustomerDetailId={setCustomerDetailId}
                                    handleCardClick={handleCardClick}
                                />
                            );
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};
