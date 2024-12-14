import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";
import { Router } from "expo-router";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Save Data
export const saveLocalStorageData = async (data: any, storageKey: string) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(storageKey, jsonData);
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

export const formatIsoDate = (
    isoString: string,
    is_DD_MM_YYYY_Format = true
) => {
    if (_isNil(isoString) || _isEmpty(isoString)) {
        return "";
    }

    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = date.getFullYear();

    if (is_DD_MM_YYYY_Format) {
        return `${day}-${month}-${year}`;
    }

    return `${year}-${month}-${day}`;
};

export const getDataToScheduleReminder = (obj: Record<string, any>) => {
    const { name, balance, dueDate } = obj;
    // Combine date and time into a single Date object
    const reminderDate = new Date(dueDate);

    const currentDate = new Date();
    const currentHour =
        reminderDate.getDate() === currentDate.getDate() &&
        currentDate.getHours() >= 18
            ? currentDate.getHours() + 1
            : 11;
    const currentMinute = 5; //currentDate.getMinutes();

    const hourToSet =
        Math.floor(Math.random() * (18 - currentHour + 1)) + currentHour;
    const minuteToSet =
        Math.floor(Math.random() * (60 - currentMinute + 1)) + currentMinute;

    reminderDate.setHours(hourToSet, minuteToSet);

    let body = "This is your scheduled reminder!";

    if (!_isNil(name) && !_isEmpty(name)) {
        body = `Connect with ${name}`;

        if (!_isNil(balance)) {
            body += ` for the pending amount: ${balance}`;
        }
    }

    return {
        content: {
            title: "Remind Credits",
            body,
            data: obj,
            priority: "high", // Set priority for visibility
        },
        trigger: reminderDate,
    };
};

type BackAcionArgs = {
    router: Router;
    handleScreenBack?: () => void;
};

export const screenBackAction = ({
    router,
    handleScreenBack,
}: BackAcionArgs) => {
    if (typeof handleScreenBack === "function") {
        handleScreenBack();
        return true;
    }

    if (router.canGoBack()) {
        router.back();
        return true;
    }

    // Exit app only if there are no more screens to go back to
    return false;
};
