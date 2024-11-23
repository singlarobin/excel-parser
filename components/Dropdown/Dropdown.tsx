import {
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    View,
    findNodeHandle,
    UIManager,
} from "react-native";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { styles } from "./Dropdown.styled";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type DropdownProps = {
    list: any[];
    multiple?: boolean;
    selectedItem?: Record<string, any> | string;
    modalStyle?: Record<string, any>;
    onChange: (value: any) => void;
};

export const Dropdown = ({
    list,
    selectedItem,
    modalStyle = {},
    onChange,
    multiple = false,
}: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const [parentLayout, setParentLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const boxRef = useRef<View>(null);

    useEffect(() => {
        // Call measure after a timeout to ensure layout is complete
        setTimeout(handleMeasure, 100);
    }, []);

    const handleMeasure = () => {
        if (!_isNil(boxRef?.current)) {
            const handle = findNodeHandle(boxRef.current) ?? 0;
            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                setParentLayout({
                    x: pageX,
                    y: pageY,
                    width,
                    height,
                });
            });
        }
    };

    const handleSelect = (item: any) => {
        setOpen(false);
        onChange(item);
    };

    const selectedValue =
        typeof selectedItem === "string"
            ? selectedItem
            : selectedItem?.label ?? "Select";

    return (
        <View ref={boxRef} collapsable={false} style={[styles.container]}>
            <TouchableOpacity
                style={styles.dropdown}
                activeOpacity={1}
                onPress={() => {
                    setOpen(true);
                }}
            >
                <Text>{selectedValue}</Text>
                <Ionicons
                    name="chevron-down-circle-outline"
                    size={20}
                    color={"gray"}
                />
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="slide"
                onRequestClose={() => setOpen(false)}
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, modalStyle]}
                    onPress={() => setOpen(false)}
                    activeOpacity={1}
                >
                    <FlatList
                        data={list}
                        style={[
                            styles.modalContent,
                            {
                                top: parentLayout.y + parentLayout.height + 4, // Align with parent's bottom
                            },
                        ]}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            <View style={[styles.emptyListContainer]}>
                                <Text>No Data</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => handleSelect(item)}
                                activeOpacity={1}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </TouchableOpacity>
            </Modal>
        </View>
    );
};
