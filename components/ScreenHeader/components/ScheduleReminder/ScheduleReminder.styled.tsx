import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    menu: {
        position: "absolute",
        top: "50%",
        left: "50%",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 8,
        padding: 16,
        paddingTop: 20,
    },
    dateContainer: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginVertical: 12,
        width: "48%",
    },
    closeIcon: {
        position: "absolute",
        right: 4,
        top: 4,
    },
});
