export function getDateofNextDay(dayOfWeek){
  let dayToNum = {Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6}
  let serviceDay = dayToNum[dayOfWeek];
  let options = {month: 'short', day: 'numeric', year: 'numeric'}

  let date = new Date(Date.now());
  if(serviceDay === undefined || serviceDay === null)
    date.setDate(date.getDate());
  else
    date.setDate(date.getDate() + (7 + serviceDay - date.getDay()) % 7);
  let dateString = date.toLocaleDateString("en-US", options);
  return dateString;
}
