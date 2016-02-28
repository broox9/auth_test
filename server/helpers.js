export function dateToUnix(date) {
  //return the date in seconds instead of milliseconds
  return parseInt((date['getTime']() / 1000), 10);
}
