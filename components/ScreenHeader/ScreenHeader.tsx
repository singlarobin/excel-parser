import { SafeAreaView, Text, View } from "react-native";
import _isNil from "lodash/isNil";
import { styles } from "./ScreenHeader.styled";

import { usePathname } from "expo-router";

type ScreenHeaderProps = {
    cartCount?: number;
    headerName?: string;
    header?: React.ReactElement;
};

const ScreenHeader = ({ cartCount, headerName, header }: ScreenHeaderProps) => {
    const pathName = usePathname();

    return (
        <SafeAreaView>
            <View style={[styles.container]}>
                {!_isNil(header) ? (
                    header
                ) : (
                    <Text style={[styles.headerText]}>
                        {" "}
                        {headerName ?? pathName.split("/")[1]}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ScreenHeader;
