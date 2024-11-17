import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    leftContainer: {
        flex: 0.6,
    },
    rightContainer: {
        flex: 0.4,
        alignItems: "flex-end",
    },
    inlineStyle: {
        flexDirection: "row",
        gap: 2,
    },
    headerText: {
        fontWeight: "bold",
    },
    redText: {
        color: "red",
    },
    iconsContainer: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "flex-end",
    },
});
