import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
    },
    firstRow: {
        flexDirection: "row",
        gap: 8,
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
        gap: 4,
        justifyContent: "flex-end",
    },
});
