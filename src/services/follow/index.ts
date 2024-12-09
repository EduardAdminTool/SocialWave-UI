const token = localStorage.getItem("authToken");

export const requestFollow = async (followee: number) => {
  try {
    const response = await fetch("http://localhost:3001/follow/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ followee }),
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

export const acceptFollow = async (followee: number) => {
  try {
    const response = await fetch("http://localhost:3001/follow/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ followee }),
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

export const rejectFollow = async (followee: number) => {
  try {
    const response = await fetch("http://localhost:3001/follow/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ followee }),
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

export const unfollowFollow = async (followee: number) => {
  try {
    const response = await fetch("http://localhost:3001/follow/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ followee }),
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

export const getFollows = async () => {
  const response = await fetch(`http://localhost:3001/follow/follow-requests`, {
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

export const getUserFollow = async (userId: number) => {
  const response = await fetch(`http://localhost:3001/follow/${userId}`, {
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

export const deleteRequest = async (followee: number) => {
  const response = await fetch(`http://localhost:3001/follow/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ followee }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
