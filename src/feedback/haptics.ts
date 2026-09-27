import * as Haptics from "expo-haptics";

function safely(task: () => Promise<void>) {
  task().catch(() => {});
}

export const haptics = {
  select: () => safely(() => Haptics.selectionAsync()),
  tap: () => safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  count: () => safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  roll: () => safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  cut: () => safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warn: () => safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
