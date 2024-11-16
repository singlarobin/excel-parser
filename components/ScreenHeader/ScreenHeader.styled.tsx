import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        // shadowColor: "grey",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.4,
        // shadowRadius: 5,
        // elevation: 2,
        width: "100%",
        height: 64,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.neutral.blue,
        // borderBottomColor: "#2022ff",
        borderBottomWidth: 0.5,
        gap: 8,
    },
    headerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    menu: {
        position: "absolute",
        top: "0%",
        right: "0%",
        width: 160,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
});
