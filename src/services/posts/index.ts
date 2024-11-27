const token = localStorage.getItem("authToken");

export const getPosts = async () => {
  const response = await fetch("http://localhost:3001/post", {
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

export const createPost = async (
  description: string,
  createdAt: Date,
  updatedAt: Date
) => {
  const createdAtString = createdAt.toISOString();
  const updatedAtString = updatedAt.toISOString();

  const response = await fetch("http://localhost:3001/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      description: description,
      createdAt: createdAtString,
      updatedAt: updatedAtString,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const deletePost = async (postId: number) => {
  const response = await fetch(`http://localhost:3001/post/${postId}`, {
    method: "DELETE",
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
