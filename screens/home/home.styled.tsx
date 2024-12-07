import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 8,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    stepContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
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
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 4,
        width: 180,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    loader: {
        width: "100%",
        flex: 1,
    },
    columnMapContainer: {
        flex: 1,
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    listContainer: {
        paddingTop: 12,
        paddingLeft: 28,
        width: "100%",
        overflow: "hidden",
    },
    listItem: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        marginBottom: 20,
    },
});
