const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (date) => {
  const dateObj = new Date(date);

  return `${dateObj.getDate()} ${
    months[dateObj.getMonth()]
  } ${dateObj.getFullYear()} at ${dateObj.getHours()}:${dateObj.getMinutes()}`;
};

export const createUrlWithQuery = (endpoint = "", queryValueObj = {}) => {
  let finalUrl = `${endpoint}?`;

  for (let query in queryValueObj) {
    if (queryValueObj[query]) {
      finalUrl += `${query}=${queryValueObj[query]}&`;
    }
  }

  return finalUrl;
};

export const getLastSixMonths = () => {
  const currentDate = new Date();
  currentDate.setDate(1);

  const lastSixMonths = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(currentDate.getMonth() - i);
    const monthName = months[monthDate.getMonth()];
    lastSixMonths.unshift(monthName);
  }
  return lastSixMonths;
};
