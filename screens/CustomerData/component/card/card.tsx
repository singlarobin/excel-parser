import {
    Text,
    View,
    Linking,
    Alert,
    TouchableOpacity,
    Modal,
} from "react-native";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { styles } from "./card.styled";
import { formatIsoDate } from "@/utils/helperFunction";
import { useState } from "react";

type CardProps = {
    data: Record<string, any>;
    index: number;
    setCustomerDetailIndex: (index: number) => void;
};

export const Card = ({ data, index, setCustomerDetailIndex }: CardProps) => {
    const { phone } = data;

    const [modalVisible, setModalVisible] = useState(false);

    const dialPhoneNumber = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;

        if (
            phoneNumber !== "-" &&
            !_isNil(phoneNumber) &&
            !_isEmpty(phoneNumber)
        ) {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        return Linking.openURL(url);
                    } else {
                        Alert.alert(
                            "Error",
                            "Unable to open dialer on this device."
                        );
                    }
                })
                .catch((error) =>
                    console.error("Error opening dialer:", error)
                );
        } else {
            Toast.show("Invalid Phone number", {
                duration: Toast.durations.SHORT,
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Name:</Text>
                    <Text> {`${data["name"] ?? "-"}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Phone:</Text>
                    <Text> {`${data["phone"] ?? "-"}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>City Name:</Text>
                    <Text> {`${data["city"] ?? "-"}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Plumber:</Text>
                    <Text> {`${data["plumber"] ?? "-"}`}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <View style={[styles.iconsContainer]}>
                    <TouchableOpacity
                        onPress={() => setCustomerDetailIndex(index)}
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color={"blue"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => dialPhoneNumber(phone)}>
                        <Ionicons name="call-sharp" size={20} color={"blue"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText]}>Balance:</Text>
                    <Text>{`${data["balance"] ?? "-"}`}</Text>
                </View>

                {/* <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText, styles.redText]}>
                        Date:
                    </Text>
                    <Text style={[styles.redText]}>{`${
                        data["Date"] ?? "N/A"
                    }`}</Text>
                </View> */}

                <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText, styles.redText]}>
                        Due Date:
                    </Text>
                    <Text style={[styles.redText]}>{`${
                        !_isNil(data["dueDate"]) && !_isEmpty(data["dueDate"])
                            ? formatIsoDate(data["dueDate"])
                            : "-"
                    }`}</Text>
                </View>
            </View>
        </View>
    );
};
