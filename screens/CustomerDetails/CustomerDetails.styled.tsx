import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    emptyDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
        marginBottom: 12,
    },
    inlineStyle: {
        flexDirection: "row",
        gap: 2,
    },
    leftText: {
        // flex: 0.4,
    },
    headerText: {
        fontWeight: "bold",
    },
});
