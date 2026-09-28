// Preserve the billing day where possible; clamp Jan 31 -> Feb 28/29.
export function addMonths(value, count) {
  const date=new Date(value),day=date.getUTCDate();
  date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+count);
  const lastDay=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
  date.setUTCDate(Math.min(day,lastDay));return date.toISOString();
}
