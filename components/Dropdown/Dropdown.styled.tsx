import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {},
    dropdown: {
        flexDirection: "row",
        padding: 8,
        borderWidth: 1,
        borderRadius: 4,
        width: 180,
        justifyContent: "space-between",
    },
    modalOverlay: {
        flex: 1,
        height: "30%",
        width: "52%",
        position: "absolute",
        top: "23%",
        right: "4%",
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        borderRadius: 4,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 4,
        elevation: 5, // Adds shadow on Android
        shadowColor: "#000", // Adds shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    item: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        width: 200,
    },
});
