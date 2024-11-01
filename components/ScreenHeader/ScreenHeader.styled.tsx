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
        // backgroundColor: "#2022ff",
        // borderBottomColor: "#2022ff",
        borderBottomWidth: 0.5,
        gap: 8,
    },
    headerText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
    },
});
