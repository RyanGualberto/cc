export function calculateLengthIntervalTimeByRecurrence(
  recurrence: "monthly" | "weekly" | "daily",
  date: Date,
  until: Date
) {
  switch (recurrence) {
    case "monthly":
      const months =
        (until.getFullYear() - date.getFullYear()) * 12 +
        (until.getMonth() - date.getMonth());
      const includeLastMonth = until.getDate() >= date.getDate() ? 1 : 0;
      return months + includeLastMonth;

    case "weekly":
      const weeks = Math.floor((until.getTime() - date.getTime()) / 604800000);
      const includeLastWeek = until.getDay() >= date.getDay() ? 1 : 0;
      return weeks + includeLastWeek;
    case "daily":
      const days = Math.floor((until.getTime() - date.getTime()) / 86400000);
      const includeLastDay = until.getHours() >= date.getHours() ? 1 : 0;
      return days + includeLastDay;
  }
}

export function calculateIntervalTimeByRecurrence(
  recurrence: "monthly" | "weekly" | "daily",
  date: Date,
  index: number
) {
  switch (recurrence) {
    case "monthly":
      const newMonthlyDate = new Date(date);
      newMonthlyDate.setMonth(date.getMonth() + index);
      return newMonthlyDate;
    case "weekly":
      const newWeekDate = new Date(date);
      newWeekDate.setDate(date.getDate() + index * 7);
      return newWeekDate;
    case "daily":
      const newDailyDate = new Date(date);
      newDailyDate.setDate(date.getDate() + index);
      return newDailyDate;
  }
}
