import { Button, View, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import type { DateData } from "react-native-calendars";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";

import { styles } from "./home.styled";
import { useEffect, useState } from "react";
import { Card } from "./component/card/card";
import {
    saveLocalStorageData,
    loadLocalStorageData,
    generateRandomId,
    formatDate,
    formatIsoDate,
} from "@/utils/helperFunction";
import { parsedDataKey } from "./constant";
import { Filter } from "./component/Filter/Filter";
import Toast from "react-native-root-toast";

export const HomeScreen = () => {
    const [fileData, setFileData] = useState<Array<Record<string, any>>>([]);
    const [filteredData, setFilteredData] = useState<
        Array<Record<string, any>>
    >([]);

    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setFilteredData(fileData);
    }, [JSON.stringify(fileData)]);

    const fetchData = async () => {
        const storedData = await loadLocalStorageData(parsedDataKey);
        if (storedData) {
            setFileData(storedData);
        }
    };

    const selectFile = async (): Promise<string | null> => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME type for .xlsx
                    "application/vnd.ms-excel", // MIME type for .xls
                ],
            });

            if (!result.canceled) {
                const fileUri = result.assets[0].uri;

                return fileUri;
                // setFileUri(fileUri);
            }
        } catch (error) {
            console.error("Error selecting file:", error);
        }

        return null;
    };

    const parseXLSX = async (fileUri: string): Promise<any[] | null> => {
        try {
            // Read the file as a base64-encoded string
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Parse the base64 string
            const workbook = XLSX.read(fileContent, { type: "base64" });

            // Get the first sheet name

            const sheetName = workbook.SheetNames[0];

            // Read data from the first sheet
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            return data; // Return the data array containing the sheet's content
        } catch (error) {
            console.error("Error parsing XLSX file:", error);
            if (error instanceof Error) {
                Toast.show(`Error parsing XLSX file=> ${error.message}`);
            }
            return null;
        }
    };

    const convertExcelDateToJsIsoDateString = (excelDate: any) => {
        if (typeof excelDate === "string") {
            const separator = (excelDate ?? "").includes("-") ? "-" : "/";
            return new Date(
                (excelDate ?? "").split(separator).reverse().join(separator)
            ).toISOString();
        } else if (typeof excelDate === "number") {
            // Base date in Google Sheets (30th December 1899)
            const baseDate = new Date(1899, 11, 30);
            // Add the excelDate as days to the base date
            const jsDate = new Date(
                baseDate.getTime() + excelDate * 24 * 60 * 60 * 1000
            );

            return jsDate.toISOString(); // Returns a valid JavaScript Date object
        }

        return excelDate;
    };

    const handleFileUpload = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const fileUri = await selectFile();
            if (fileUri) {
                let data = await parseXLSX(fileUri);

                data = (data ?? []).map((obj) => ({
                    ...obj,
                    id: generateRandomId(),
                    DD1: convertExcelDateToJsIsoDateString(obj["DD1"]),
                }));

                (data ?? []).sort((a, b) => {
                    const dateA = new Date(a["DD1"]);
                    const dateB = new Date(b["DD1"]);

                    return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0); // Ascending order
                });

                setFileData(data ?? []);

                saveLocalStorageData(data ?? [], parsedDataKey);

                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log("Error =>", error);
            if (error instanceof Error) {
                Toast.show(`Error Uploading File => ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleListFiltering2 = (type: string, value: any) => {
        if (value === "" || value === undefined) {
            if (
                (type === "search" && selectedDate === "") ||
                (type === "dueDate" && searchValue === "")
            ) {
                setFilteredData(fileData);
            } else if (type === "search" && selectedDate !== "") {
                setFilteredData(
                    fileData?.filter(
                        (obj) => (obj["DD1"] ?? "") === formatDate(value)
                    )
                );
            } else if (type === "dueDate" && searchValue !== "") {
                setFilteredData(
                    fileData?.filter((obj) =>
                        (obj["Head of Account"] ?? "")
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    )
                );
            }
        } else {
            if (type === "search" && selectedDate === "") {
                setFilteredData(
                    fileData?.filter((obj) =>
                        (obj["Head of Account"] ?? "")
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    )
                );
            } else if (type === "dueDate" && searchValue === "") {
                setFilteredData(
                    fileData?.filter(
                        (obj) => (obj["DD1"] ?? "") === formatDate(value)
                    )
                );
            } else if (type === "search" && selectedDate !== "") {
                setFilteredData(
                    fileData?.filter(
                        (obj) =>
                            (obj["DD1"] ?? "") === formatDate(selectedDate) &&
                            (obj["Head of Account"] ?? "")
                                .toLowerCase()
                                .includes(value.toLowerCase())
                    )
                );
            } else if (type === "dueDate" && searchValue !== "") {
                setFilteredData(
                    fileData?.filter(
                        (obj) =>
                            (obj["DD1"] ?? "") === formatDate(value) &&
                            (obj["Head of Account"] ?? "")
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                    )
                );
            }
        }
    };

    const handleListFiltering = (type: string, value: any) => {
        const searchTerm = type === "search" ? value : searchValue;
        const dueDate = type === "dueDate" ? value : selectedDate;

        const filteredData = fileData?.filter((obj) => {
            const matchesSearch = searchTerm
                ? (obj["Head of Account"] ?? "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true;

            const currentDueDate =
                !_isNil(obj["DD1"]) && !_isEmpty(obj["DD1"])
                    ? formatIsoDate(obj["DD1"])
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
                    <View style={[styles.btnStyle]}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <Button
                                title="Upload File"
                                onPress={handleFileUpload}
                            />
                        )}
                    </View>
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
                    <View style={styles.header}>
                        <View style={[styles.btnStyle2]}>
                            {isLoading ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                />
                            ) : (
                                <Button
                                    title="Upload File"
                                    onPress={handleFileUpload}
                                />
                            )}
                        </View>
                    </View>
                    {!isLoading && (
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
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};
