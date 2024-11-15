import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { styles } from "./Dropdown.styled";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type DropdownProps = {
    list: any[];
    selectedItem?: Record<string, any> | string;
    modalStyle?: Record<string, any>;
    onChange: (value: any) => void;
};

export const Dropdown = ({
    list,
    selectedItem,
    modalStyle = {},
    onChange,
}: DropdownProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleSelect = (item: any) => {
        setIsVisible(false);
        onChange(item);
    };

    const selectedValue =
        typeof selectedItem === "string"
            ? selectedItem
            : selectedItem?.label ?? "Select";

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                    if (!_isNil(list) && !_isEmpty(list)) {
                        setIsVisible(true);
                    }
                }}
            >
                <Text>{selectedValue}</Text>
                <Ionicons
                    name="chevron-down-circle-outline"
                    size={20}
                    color={"gray"}
                />
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="slide">
                <View style={[styles.modalOverlay, modalStyle]}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={list}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
                {/* <View style={[styles.modalContainer]}>
                    <FlatList
                        data={list}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => handleSelect(item)}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View> */}
            </Modal>
        </View>
    );
};
