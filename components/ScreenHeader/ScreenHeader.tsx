import {
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import _isNil from "lodash/isNil";
import { styles } from "./ScreenHeader.styled";

import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { saveLocalStorageData } from "@/utils/helperFunction";
import { parsedDataKey } from "@/screens/CustomerData/constant";

type ScreenHeaderProps = {
    cartCount?: number;
    headerName?: string;
    header?: React.ReactElement;
};

const ScreenHeader = ({ headerName, header }: ScreenHeaderProps) => {
    const pathName = usePathname();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);

    const handleModalItemClick = (type: string) => {
        setModalVisible(false);
        if (type === "uploadFile") {
            saveLocalStorageData([], parsedDataKey);
            router.push("/");
        }
    };

    const isHomePath = pathName === "/";

    return (
        <SafeAreaView>
            {!_isNil(header) ? (
                header
            ) : (
                <View style={[styles.container]}>
                    <Text style={[styles.headerText]}>
                        {headerName ?? pathName.split("/")[1]}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons
                            name="menu-outline"
                            color={"white"}
                            size={30}
                        />
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType="none"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity
                            style={[styles.overlay]}
                            onPress={() => setModalVisible(false)}
                        >
                            <View style={styles.menu}>
                                {!isHomePath && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleModalItemClick("uploadFile")
                                        }
                                    >
                                        <Text style={styles.menuItem}>
                                            Upload New File
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {!isHomePath && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleModalItemClick(
                                                "scheduleReminder"
                                            )
                                        }
                                    >
                                        <Text style={styles.menuItem}>
                                            Schedule Reminder
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() =>
                                        handleModalItemClick("openUserManual")
                                    }
                                >
                                    <Text style={styles.menuItem}>
                                        User Manual
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            )}
        </SafeAreaView>
    );
};

export default ScreenHeader;
