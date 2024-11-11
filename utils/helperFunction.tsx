import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

// Save Data
export const saveLocalStorageData = async (data: any, storageKey: string) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(storageKey, jsonData);
        console.log("Data saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

// Load Data
export const loadLocalStorageData = async (storageKey: string) => {
    try {
        const jsonData = await AsyncStorage.getItem(storageKey);
        if (jsonData !== null) {
            const data = JSON.parse(jsonData);
            console.log("Data loaded successfully!", data);
            return data;
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
    return null;
};

export const generateRandomId = async () => {
    const id = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
    );

    return id;
};

export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
};
