export const getCurrentTime = () => {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = (currentDateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDateTime.getDate().toString().padStart(2, "0");
  const hours = currentDateTime.getHours().toString().padStart(2, "0");
  const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentDateTime.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
