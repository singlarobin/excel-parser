import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import {
    formatIsoDate,
    loadLocalStorageData,
    saveLocalStorageData,
    screenBackAction,
} from "@/utils/helperFunction";
import { Colors } from "@/constants/Colors";

import { parsedDataKey } from "../CustomerData/constant";
import { styles } from "./CustomerDetails.styled";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { DetailUpdate } from "../CustomerData/component/DetailUpdate/DetailUpdate";
import { useUpdateNotification } from "../CustomerData/hooks/useUpdateNotification";

export const CustomerDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [fileData, setFileData] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isDetailUpdate, setIsDetailUpdate] = useState(false);

    const { updateNotificationReminder } = useUpdateNotification();

    const handleScreenBack = () => {
        if (isDetailUpdate) {
            setIsDetailUpdate(false);
        } else if (router.canGoBack()) {
            router.back();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => screenBackAction({ router, handleScreenBack })
        );

        return () => {
            backHandler.remove();
        };
    }, [isDetailUpdate]);

    const fetchData = async () => {
        setIsLoading(true);
        const storedData = await loadLocalStorageData(parsedDataKey);
        setIsLoading(false);
        if (storedData) {
            setFileData(storedData);
        }
    };

    const dialPhoneNumber = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;

        if (phoneNumber !== "-" && !_isNil(phoneNumber)) {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        return Linking.openURL(url);
                    } else {
                        Alert.alert(
                            "Error",
                            `This device cannot open the dialer. Please call manually: ${phoneNumber}`
                        );
                    }
                })
                .catch((error) =>
                    console.error("Error opening dialer:", error)
                );
        } else {
            Toast.show(`Invalid Phone number: ${phoneNumber}`, {
                duration: Toast.durations.SHORT,
            });
        }
    };

    const updateData = async (
        obj: Record<string, any>,
        time?: { hour: number; minute: number }
    ) => {
        const notificationId = await updateNotificationReminder(obj, time);

        const updatedFileData = fileData
            .map((data) => {
                if (data.id === obj.id) {
                    return {
                        ...obj,
                        notificationId,
                        isUpdated: true,
                    };
                }

                return data;
            })
            .sort((a, b) => {
                const dateA = new Date(a["dueDate"]);
                const dateB = new Date(b["dueDate"]);

                return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0); // Ascending order
            });

        setFileData(updatedFileData);
        saveLocalStorageData(updatedFileData ?? [], parsedDataKey);
        setIsDetailUpdate(false);
    };

    const data = fileData.find((obj) => obj.id == id);

    if (isDetailUpdate && !_isNil(data)) {
        return <DetailUpdate data={data} updateData={updateData} />;
    }

    return (
        <View style={styles.container}>
            {_isNil(data) || _isEmpty(data) || isLoading ? (
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
            ) : (
                <View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity
                            onPress={() => setIsDetailUpdate(true)}
                        >
                            <Ionicons
                                name="create-outline"
                                size={20}
                                color={"blue"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => dialPhoneNumber(data.phone)}
                        >
                            <Ionicons
                                name="call-sharp"
                                size={20}
                                color={"blue"}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Name:
                        </Text>
                        <Text numberOfLines={2} style={{ flex: 1 }}>
                            {`${data["name"] ?? "-"}`}
                        </Text>
                    </View>
                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Phone:
                        </Text>
                        <Text> {`${data["phone"] ?? "-"}`}</Text>
                        {!_isNil(
                            data["phone2"] && !_isEmpty(data["phone2"])
                        ) && <Text>{`, ${data["phone2"]}`}</Text>}
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            City Name:
                        </Text>
                        <Text> {`${data["city"] ?? "-"}`}</Text>
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Guarantor:
                        </Text>
                        <Text> {`${data["plumber"] ?? "-"}`}</Text>
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Balance:
                        </Text>
                        <Text>{`${data["balance"] ?? "-"}`}</Text>
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Due Date:
                        </Text>
                        <Text>{`${
                            !_isNil(data["dueDate"]) &&
                            !_isEmpty(data["dueDate"])
                                ? formatIsoDate(data["dueDate"])
                                : "-"
                        }`}</Text>
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Category:
                        </Text>
                        <Text>{`${data["category"] ?? "-"}`}</Text>
                    </View>

                    <View style={styles.inlineStyle}>
                        <Text style={[styles.headerText, styles.leftText]}>
                            Tour:
                        </Text>
                        <Text>{`${data["tour"] ?? "-"}`}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};
