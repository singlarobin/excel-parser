import { Text, View, Linking, Alert } from "react-native";
import Toast from "react-native-root-toast";
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
            <Text onPress={() => dialPhoneNumber(Phone)}>{Phone ?? "-"}</Text>
        </View>
    );
};
