const token = localStorage.getItem("authToken");

export const getNotifications = async () => {
  const response = await fetch(`http://localhost:3001/notification`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
