function getDayInWeekFromDkDate(input) {
  if (input === null) {
    throw new Error("Provided date is null");
  }
  const dp = input.split("-");

  const dayInWeek = new Date(dp[2], dp[1] - 1, dp[0]).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thuersday",
    "Friday",
    "Saturday"
  ];
  return days[dayInWeek];
}
function getDateFromDkDate(date) {
  if (date === null || !date.includes("-")) {
    return date;
  }
  const dp = date.split("-");
  return new Date(dp[2], dp[1] - 1, dp[0]).getTime();
}

// function getDateFromDkDate(date) {
//   const dp = date.split("-");
//   return new Date(dp[2], dp[1] - 1, dp[0]);
// }

export { getDateFromDkDate, getDayInWeekFromDkDate };
