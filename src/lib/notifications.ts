import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let isConfigured = false;

export const configureNotifications = async (): Promise<void> => {
  if (isConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  isConfigured = true;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  await configureNotifications();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
};

export const scheduleReminderNotification = async (
  title: string,
  body: string,
  date: string
): Promise<string | null> => {
  const granted = await requestNotificationPermission();
  if (!granted) {
    return null;
  }

  const triggerDate = new Date(date);
  if (Number.isNaN(triggerDate.getTime())) {
    return null;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate
    }
  });
  return id;
};

export const cancelScheduledNotification = async (notificationId?: string): Promise<void> => {
  if (!notificationId) {
    return;
  }
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};
