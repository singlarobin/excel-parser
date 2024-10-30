import { Text, View, Linking, Alert, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";

import _isNil from "lodash/isNil";

import { styles } from "./card.styled";

type CardProps = {
    data: Record<string, any>;
};

export const Card = ({ data }: CardProps) => {
    const { Phone } = data;

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
                    <Text> {`${data["Head of Account"]}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Phone:</Text>
                    <Text> {`${data["Phone"] ?? "-"}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>City Name:</Text>
                    <Text> {`${data["City Name"]}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Plumber:</Text>
                    <Text> {`${data["pl"]}`}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={() => dialPhoneNumber(Phone)}>
                    <Ionicons name="call-sharp" size={20} color={"blue"} />
                </TouchableOpacity>

                <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText]}>Balance:</Text>
                    <Text>{`${data["Balance"]}`}</Text>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText, styles.redText]}>
                        Due Date:{" "}
                    </Text>
                    <Text style={[styles.redText]}>{`${
                        data["Due Date"] ?? "N/A"
                    }`}</Text>
                </View>
            </View>
        </View>
    );
};
