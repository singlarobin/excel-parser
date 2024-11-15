import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    stepContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 40,
        marginBottom: 8,
    },
    stepNameStyle: {
        fontSize: 16,
    },
    stepRightContainer: {
        flexDirection: "row",
        gap: 8,
    },
    loader: {
        width: "100%",
        height: "78.5%",
    },
    columnMapContainer: {
        height: "70%",
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    listContainer: {
        paddingTop: 12,
        paddingLeft: 28,
        width: "100%",
    },
    listItem: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        marginBottom: 8,
    },
});
