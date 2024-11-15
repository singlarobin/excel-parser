import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const generateRandomId = () => {
    return btoa(Math.random().toString() + Date.now().toString());
};

export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
};

export const formatIsoDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};
