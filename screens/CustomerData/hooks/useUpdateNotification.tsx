import * as Notifications from "expo-notifications";
import _isEmpty from "lodash/isEmpty";

import { getDataToScheduleReminder } from "@/utils/helperFunction";

export const useUpdateNotification = () => {
    const cancelNotification = async (notificationId: string) => {
        if (!_isEmpty(notificationId)) {
            await Notifications.cancelScheduledNotificationAsync(
                notificationId
            );
            console.log("Notification Cancelled:", notificationId);
        } else {
            console.log("No notification to cancel.");
        }
    };

    const updateNotificationReminder = async (
        data: Record<string, any>,
        time?: { hour: number; minute: number }
    ) => {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
            alert("You need to enable permissions for notifications to work!");
        } else {
            const { notificationId } = data;

            await cancelNotification(notificationId);

            const notificationContent = getDataToScheduleReminder(data, time);
            const id = await Notifications.scheduleNotificationAsync(
                notificationContent
            );

            return id;
        }

        return "";
    };

    return {
        updateNotificationReminder,
        cancelNotification,
    };
};
