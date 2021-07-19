const numberToDay = (day: number) => {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Sunday";
  }
};

const numberToMonth = (month: number) => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "January";
  }
};

const formatTime = (hours: number, minutes: number) => {
  if (hours < 10) {
    if (minutes < 10) {
      return `0${hours}:0${minutes}`;
    } else {
      return `0${hours}:${minutes}`;
    }
  } else {
    return `${hours}:${minutes}`;
  }
};

const formatDate = (date: Date) => {
  const dayOfWeek = numberToDay(date.getDay());
  const day = date.getDate();
  const month = numberToMonth(date.getMonth());
  const year = date.getFullYear();
  let suffix;

  switch (day) {
    case 1:
    case 21:
    case 31:
      suffix = "st";
      break;
    case 2:
    case 22:
      suffix = "nd";
      break;
    case 3:
    case 23:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  return [
    dayOfWeek,
    day,
    suffix,
    month,
    year,
    formatTime(date.getHours(), date.getMinutes()),
  ];
};

export { formatDate };
