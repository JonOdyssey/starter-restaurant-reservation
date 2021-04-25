import { formatAsTime } from "./date-time";

export function formatMobileNumber(mobilephone) {
  let formattedMobile = mobilephone.split("-");
  formattedMobile = `(${formattedMobile[0]}) ${formattedMobile[1]}-${formattedMobile[2]}`;
  return formattedMobile;
}

export function formatTime(reservationTime) {
  let time = formatAsTime(reservationTime).split(":");

  let AMPM = "AM";



  if (Number(time[0]) > 12 ) {
    time[0] = `${Math.floor(Number(time[0]) - 12)}`
    AMPM = "PM";
  }


  return `${time[0]}:${time[1]} ${AMPM}`;
}

export function formatDate(reservationDate) {
  let formattedDate = reservationDate.split("-");
  let MM = formattedDate[1];
  let DD = formattedDate[2];
  let YYYY = formattedDate[0];

  let month = "";

  switch (MM) {
    case "01":
      month = "January";
      break;
    case "02":
      month = "Febuary";
      break;
    case "03":
      month = "March";
      break;
    case "04":
      month = "April";
      break;
    case "05":
      month = "May";
      break;
    case "06":
      month = "June";
      break;
    case "07":
      month = "July";
      break;
    case "08":
      month = "August";
      break;
    case "09":
      month = "September";
      break;
    case "10":
      month = "October";
      break;
    case "11":
      month = "November";
      break;
    case "12":
      month = "December";
      break;
    default:
      month = "January";
  }

  return `${month} ${DD}, ${YYYY}`;
}
