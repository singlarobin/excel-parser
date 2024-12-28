import { Text, View, Linking, Alert, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { styles } from "./card.styled";
import { formatIsoDate } from "@/utils/helperFunction";
import { memo } from "react";

type CardProps = {
    data: Record<string, any>;
    setCustomerDetailId: (id: string) => void;
    handleCardClick: (id: string) => void;
};

export const Card = memo(
    ({ data, setCustomerDetailId, handleCardClick }: CardProps) => {
        const { phone } = data;

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

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.container}
                onPress={() => handleCardClick(data.id)}
            >
                <View style={styles.firstRow}>
                    <Text style={styles.headerText}>Name:</Text>
                    <Text numberOfLines={2} style={{ flex: 1 }}>
                        {`${data["name"] ?? "-"}`}
                    </Text>
                    <View style={[styles.iconsContainer]}>
                        <TouchableOpacity
                            onPress={() => setCustomerDetailId(data["id"])}
                        >
                            <Ionicons
                                name="create-outline"
                                size={20}
                                color={"blue"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => dialPhoneNumber(phone)}
                        >
                            <Ionicons
                                name="call-sharp"
                                size={20}
                                color={"blue"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>Phone:</Text>
                    <Text> {`${data["phone"] ?? "-"}`}</Text>
                    {!_isNil(data["phone2"] && !_isEmpty(data["phone2"])) && (
                        <Text>{`, ${data["phone2"]}`}</Text>
                    )}
                </View>

                <View style={styles.inlineStyle}>
                    <Text style={styles.headerText}>City Name:</Text>
                    <Text> {`${data["city"] ?? "-"}`}</Text>
                </View>
                {/* 
            <View style={styles.inlineStyle}>
                <Text style={styles.headerText}>Guarantor:</Text>
                <Text> {`${data["plumber"] ?? "-"}`}</Text>
            </View> */}

                <View style={styles.inlineStyle}>
                    <Text style={[styles.headerText]}>Balance:</Text>
                    <Text>{`${data["balance"] ?? "-"}`}</Text>
                </View>

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
            </TouchableOpacity>
        );
    }
);
