import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";

import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX, { WorkSheet } from "xlsx";
import * as Notifications from "expo-notifications";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

import {
    generateRandomId,
    loadLocalStorageData,
    saveLocalStorageData,
} from "@/utils/helperFunction";
import { parsedDataKey } from "../CustomerData/constant";
import { styles } from "./home.styled";
import { Colors } from "@/constants/Colors";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { mapToFieldObj } from "./constant";
import { useRootNavigationState, useRouter } from "expo-router";

export const HomeScreen = () => {
    const router = useRouter();

    const [fileName, setFileName] = useState<string>();
    const [selectedSheet, setSelectedSheet] = useState<string>();

    const [selectedSheetColumnList, setSelectedSheetColumnList] = useState<
        string[]
    >([]);
    const [sheetNameList, setSheetNameList] = useState<string[]>([]);

    const [allSheetsData, setAllSheetsData] = useState<{
        [sheetName: string]: WorkSheet;
    }>();

    const [fieldList, setFieldList] = useState<
        Array<{
            label: string;
            value: string;
            selecedColumn?: string;
        }>
    >([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        setDefautlFieldList();
    }, []);

    const setDefautlFieldList = () => {
        const currFieldList = Object.entries(mapToFieldObj).map(
            ([key, value]) => ({
                value: key,
                label: value,
            })
        );
        setFieldList(currFieldList);
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
                const fileName = result.assets?.[0].name.split(".")[0];
                setFileName(fileName);

                const fileUri = result.assets[0].uri;

                return fileUri;
                // setFileUri(fileUri);
            }
        } catch (error) {
            console.error("Error selecting file:", error);
        }

        return null;
    };

    const parseXLSX = async (fileUri: string) => {
        try {
            // Read the file as a base64-encoded string
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Parse the base64 string
            const workbook = XLSX.read(fileContent, { type: "base64" });

            setSheetNameList(workbook.SheetNames);
            setAllSheetsData(workbook.Sheets);
        } catch (error) {
            console.error("Error parsing XLSX file:", error);
            if (error instanceof Error) {
                Toast.show(`Error parsing file=> ${error.message}`);
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
                await parseXLSX(fileUri);

                setDefautlFieldList();
                setSelectedSheet(undefined);
                setSelectedSheetColumnList([]);
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

    const handleSheetSelection = (selectedSheet: any) => {
        setSelectedSheet(selectedSheet);
        setDefautlFieldList();

        if (!_isNil(allSheetsData)) {
            const sheet = allSheetsData[selectedSheet];
            const data = XLSX.utils.sheet_to_json(sheet) as any[];

            if (!_isNil(data) && !_isEmpty(data)) {
                setSelectedSheetColumnList(Object.keys(data[0]));
            }
        }
    };

    const convertDataBasedOnColumnMap = (data: any[]) => {
        const updatedData = cloneDeep(data);

        const mappedColumnData = fieldList.reduce(
            (acc: Record<string, string>, item) => {
                if (item.selecedColumn) {
                    acc[item.selecedColumn] = item.value;
                }
                return acc;
            },
            {}
        );

        const mappedKeysList = Object.keys(mappedColumnData);

        return updatedData.map((obj) => {
            const otherData = mappedKeysList.reduce(
                (acc: Record<string, string>, key) => {
                    return {
                        ...acc,
                        [mappedColumnData[key]]: obj[key],
                    };
                },
                {}
            );
            return {
                ...obj,
                ...otherData,
            };
        });
    };

    const cancelOldNotifications = async (notificationIds: string[]) => {
        notificationIds.forEach(async (id) => {
            await Notifications.cancelScheduledNotificationAsync(id);
        });
    };

    const handleImport = async () => {
        try {
            if (!_isNil(allSheetsData) && !_isNil(selectedSheet)) {
                const sheet = allSheetsData[selectedSheet];
                let data = XLSX.utils.sheet_to_json(sheet) as any[];

                data = convertDataBasedOnColumnMap(data);

                const storedData: any[] = await loadLocalStorageData(
                    parsedDataKey
                );

                const notificationIdsToCancel: string[] = [];

                // Convert the already stored local data to map and get all scheduled notification ids for cancellation
                const storedDataMap: Record<string, any> =
                    storedData?.reduce((acc: Record<string, any>, obj) => {
                        if (
                            !_isNil(obj["notificationId"]) &&
                            !_isEmpty(obj["notificationId"])
                        ) {
                            notificationIdsToCancel.push(obj["notificationId"]);
                        }

                        return {
                            ...acc,
                            [obj["id"]]: obj,
                        };
                    }, {}) ?? {};

                await cancelOldNotifications(notificationIdsToCancel);

                data = (data ?? []).map((obj) => {
                    if (obj.hasOwnProperty("dueDate")) {
                        obj = {
                            ...obj,
                            dueDate: convertExcelDateToJsIsoDateString(
                                obj["dueDate"]
                            ),
                        };
                    }

                    if (!obj.hasOwnProperty("id")) {
                        obj = {
                            ...obj,
                            id: generateRandomId(),
                        };
                    }

                    // If stored Data has Due Date updated then retain that date
                    if (
                        storedDataMap.hasOwnProperty(obj["id"]) &&
                        storedDataMap[obj["id"]]["isUpdated"]
                    ) {
                        obj = {
                            ...obj,
                            dueDate: storedDataMap[obj["id"]]["dueDate"],
                        };
                    }
                    return obj;
                });

                if (data?.[0].hasOwnProperty("dueDate")) {
                    (data ?? []).sort((a, b) => {
                        const dateA = new Date(a["dueDate"]);
                        const dateB = new Date(b["dueDate"]);

                        return (
                            (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0)
                        ); // Ascending order
                    });
                }

                saveLocalStorageData(data ?? [], parsedDataKey);
                router.push("/CustomerListRoute");
            } else {
                Toast.show("Please select file and sheet to proceed", {
                    duration: Toast.durations.SHORT,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                Toast.show(`Import Error => ${error.message}`);
            }
        }
    };

    const handleScrollStart = () => {
        console.log("Scrolling started");
        setIsScrolling(true);
    };

    const handleScrollEnd = () => {
        console.log("Scrolling ended");
        setIsScrolling(false);
    };

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={[styles.stepContainer]}>
                <Text style={[styles.stepNameStyle]}>1. Select File</Text>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleFileUpload}
                    style={[styles.stepRightContainer]}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                maxWidth: 100,
                            },
                        ]}
                    >
                        {fileName ?? "Upload File"}
                    </Text>

                    <Ionicons
                        name="duplicate-outline"
                        color={"gray"}
                        size={24}
                    />
                </TouchableOpacity>
            </View>
            {isLoading && (
                <View style={[styles.loader]}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.neutral.blue}
                    />
                </View>
            )}
            {!isLoading && (
                <View style={[styles.stepContainer]}>
                    <Text style={[styles.stepNameStyle]}>2. Select Sheet</Text>
                    <Dropdown
                        list={sheetNameList}
                        onChange={handleSheetSelection}
                        selectedItem={selectedSheet}
                    />
                </View>
            )}
            {!isLoading && (
                <View style={[styles.columnMapContainer]}>
                    <Text style={[styles.stepNameStyle]}>
                        3. Map Sheet Columns
                    </Text>

                    <FlatList
                        style={[styles.listContainer]}
                        data={fieldList}
                        keyExtractor={(item) => item.value}
                        onScrollBeginDrag={handleScrollStart} // Detect when scrolling starts
                        onScrollEndDrag={handleScrollEnd} // Detect when scrolling ends
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.listItem}
                                // onPress={() => handleSelect(item)}
                            >
                                <Text>{item.label}</Text>
                                <Dropdown
                                    list={selectedSheetColumnList}
                                    selectedItem={
                                        fieldList?.[index].selecedColumn
                                    }
                                    onChange={(value) => {
                                        const updatedFiedList =
                                            cloneDeep(fieldList);
                                        updatedFiedList[index] = {
                                            ...updatedFiedList[index],
                                            selecedColumn: value,
                                        };

                                        setFieldList(updatedFiedList);
                                    }}
                                    measureLayout={isScrolling}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            <View
                style={[
                    {
                        width: "100%",
                        alignItems: "center",
                        backgroundColor: Colors.neutral.blue,
                    },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={[{ width: "25%", paddingVertical: 12 }]}
                    onPress={handleImport}
                >
                    <Text
                        style={{
                            color: Colors.neutral.white,
                            fontSize: 16,
                            fontWeight: "500",
                        }}
                    >
                        IMPORT
                    </Text>
                    {/* <Button
                        title="Import"
                        color={Colors.neutral.blue}
                        
                    /> */}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
