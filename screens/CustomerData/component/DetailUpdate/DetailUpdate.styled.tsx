import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
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
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    calendarContainer: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    button: {
        marginTop: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#2196F3",
        borderRadius: 2,
    },
    clearBtn: {
        backgroundColor: "#f54153",
    },
    buttonText: {
        color: "white",
    },
});
