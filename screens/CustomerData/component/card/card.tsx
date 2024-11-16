import { Text, View, Linking, Alert, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { styles } from "./card.styled";
import { formatIsoDate } from "@/utils/helperFunction";

type CardProps = {
    data: Record<string, any>;
};

export const Card = ({ data }: CardProps) => {
    const { phone } = data;

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
                <TouchableOpacity onPress={() => dialPhoneNumber(phone)}>
                    <Ionicons name="call-sharp" size={20} color={"blue"} />
                </TouchableOpacity>

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
