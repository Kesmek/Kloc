const formatDate = (rawDate: Date | number) => {
  const date = new Date(rawDate);

  const day = date.getDate();
  const rawMonth = date.getMonth();
  const year = date.getFullYear();
  const rawDayOfWeek = date.getDay();
  const month = formatMonth(rawMonth);
  const dayOfWeek = formatDay(rawDayOfWeek);
  const prefix = getPrefix(day);

  return {
    day,
    rawMonth,
    year,
    rawDayOfWeek,
    month,
    dayOfWeek,
    prefix,
  };
};

const formatMonth = (month: number) => {
  switch (month) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      return 'January';
  }
};

const formatDay = (day: number) => {
  switch (day) {
    case 0:
      return 'Monday';
    case 1:
      return 'Tuesday';
    case 2:
      return 'Wednesday';
    case 3:
      return 'Thursday';
    case 4:
      return 'Friday';
    case 5:
      return 'Saturday';
    case 6:
    default:
      return 'Sunday';
  }
};

const getPrefix = (day: number) => {
  switch (day) {
    case 1:
    case 21:
    case 31:
      return 'st';
    case 2:
    case 22:
      return 'nd';
    case 3:
    case 23:
      return 'rd';
    case 4:
    case 24:
    default:
      return 'th';
  }
};

export { formatDate };
