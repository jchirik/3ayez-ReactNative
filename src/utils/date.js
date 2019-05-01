import moment from "moment"

export function formatUTCDate(dateString, dateFormat = "yyyy-MM-dd") {
  return moment.utc(dateString, dateFormat).toDate()
}

export function getMonth(date) {
  return date.getMonth() + 1
}

export function getYear(date) {
  return date.getFullYear()
}
