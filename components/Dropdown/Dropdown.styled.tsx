import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
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
        alignItems: "flex-end",
    },
    modalContent: {
        position: "absolute",
        zIndex: 100,
        right: 8,
        backgroundColor: "white",
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        maxHeight: 200,
    },
    item: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        width: 200,
    },
    emptyListContainer: {
        padding: 8,
        width: 200,
        minHeight: 80,
        alignItems: "center",
        justifyContent: "center",
    },
});
