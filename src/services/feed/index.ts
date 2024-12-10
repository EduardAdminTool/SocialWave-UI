const token = localStorage.getItem("authToken");

export const getFeed = async (page: number = 1) => {
  const response = await fetch(`http://localhost:3001/feed/page=${page}`, {
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

export const createLike = async (postId: number) => {
  try {
    const response = await fetch(`http://localhost:3001/like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting follow:", error);
    throw error;
  }
};

export const deleteLike = async (postId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3001/like/unlike/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting follow:", error);
    throw error;
  }
};
