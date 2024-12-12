const token = localStorage.getItem("authToken");

export const getChat = async () => {
  const response = await fetch(`http://localhost:3001/chat`, {
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

export const createChat = async (userId: number) => {
  try {
    const createdAt = new Date().toISOString();

    const response = await fetch(`http://localhost:3001/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChatPage = async (chatId: number, page: number) => {
  const response = await fetch(
    `http://localhost:3001/chat/messages?chatId=${chatId}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
