import { Button, View, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { styles } from "./home.styled";
import { useEffect, useState } from "react";
import { Card } from "./component/card/card";
import {
    saveLocalStorageData,
    loadLocalStorageData,
} from "@/utils/helperFunction";
import { parsedDataKey } from "./constant";

export const HomeScreen = () => {
    const [fileData, setFileData] = useState<Array<Record<string, any>>>();
    const [isLoading, setIsLoading] = useState(false);

    console.log("=========>", fileData?.[0]);

    useEffect(() => {
        fetchData();
    }, []);

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
            return null;
        }
    };

    const handleFileUpload = async (): Promise<void> => {
        setIsLoading(true);
        const fileUri = await selectFile();
        if (fileUri) {
            const data = await parseXLSX(fileUri);

            (data ?? []).sort((a, b) => {
                const dateA = new Date(a["DD1"].split("-").reverse().join("-"));
                const dateB = new Date(b["DD1"].split("-").reverse().join("-"));
                return dateA.getTime() - dateB.getTime(); // Ascending order
            });

            setFileData(data ?? []);
            saveLocalStorageData(data ?? [], parsedDataKey);
            setIsLoading(false);
            //console.log("Extracted Data:", data, typeof data);
        } else {
            setIsLoading(false);
        }
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
                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={fileData}
                        ItemSeparatorComponent={() => (
                            <View style={styles.horizontalLine} />
                        )}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => {
                            return <Card key={index} data={item} />;
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};
