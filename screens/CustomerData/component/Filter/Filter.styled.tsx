import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    filterContainer: {
        marginTop: 4,
        marginBottom: 20,
        gap: 20,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    searchBox: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 4,

        flex: 1,
        flexDirection: "row",
        gap: 12,
    },
    searchText: {
        flex: 1,
    },
    dropdown: {
        borderWidth: 0,
        borderRadius: 0,
        borderColor: "gray",
        borderLeftWidth: 1,
        width: 108,
        paddingVertical: 4,
        paddingHorizontal: 4,
        gap: 4,
    },
    dateContainer: {
        marginRight: 8,
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
        gap: 8,
    },
    button: {
        marginTop: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#2196F3",
        borderRadius: 4,
    },
    clearBtn: {
        backgroundColor: "#f54153",
    },
    buttonText: {
        color: "white",
    },
    chip: {
        flexDirection: "row",
        width: "65%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "grey",
        paddingHorizontal: 12,
        paddingVertical: 4,
        position: "relative",
    },
    chipBoldText: {
        fontWeight: "600",
    },
    closeIcon: {
        position: "absolute",
        top: -10,
        right: -10,
        backgroundColor: "white",
        padding: 0,
        margin: 0,
    },
});
