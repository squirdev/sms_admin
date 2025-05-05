export function getSimplifiedDateTime(isoString) {
  const date = new Date(isoString);

  // Get the date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  // Get the time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format the output as YYYY-MM-DD HH:mm:ss
  const simpleDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  return simpleDateTime;
}
