const token = localStorage.getItem("authToken");

export const createComment = async (postId: number, text: string) => {
  try {
    const response = await fetch("http://localhost:3001/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ postId, text }),
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

export const deleteComment = async (commentId: number) => {
  try {
    const response = await fetch("http://localhost:3001/comment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ commentId }),
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

export const updateComment = async (
  commentId: number,
  text: string,
  userId: number
) => {
  try {
    const response = await fetch("http://localhost:3001/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ commentId, text, userId }),
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
