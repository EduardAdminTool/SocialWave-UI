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
  createdAt: string,
  updatedAt: string,
  media: File
) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("createdAt", createdAt);
  formData.append("updatedAt", updatedAt);
  formData.append("images", media);

  const response = await fetch("http://localhost:3001/post", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData, // Proper multipart/form-data request
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

export const getPostsById = async (id: number) => {
  const response = await fetch(`http://localhost:3001/post/${id}`, {
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
