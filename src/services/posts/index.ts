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

export const createStory = async (media: File[]) => {
  const formData = new FormData();

  media.forEach((file, index) => {
    if (file.type.startsWith("image/")) {
      formData.append(
        "images",
        file,
        `image_${index}.${file.name.split(".").pop()}`
      );
    } else if (file.type.startsWith("video/")) {
      formData.append(
        "videos",
        file,
        `video_${index}.${file.name.split(".").pop()}`
      );
    }
  });
  const response = await fetch("http://localhost:3001/story", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
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
  media: File[]
) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("createdAt", createdAt);
  formData.append("updatedAt", updatedAt);

  media.forEach((file, index) => {
    if (file.type.startsWith("image/")) {
      formData.append(
        "images",
        file,
        `image_${index}.${file.name.split(".").pop()}`
      );
    } else if (file.type.startsWith("video/")) {
      formData.append(
        "videos",
        file,
        `video_${index}.${file.name.split(".").pop()}`
      );
    }
  });

  const response = await fetch("http://localhost:3001/post", {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
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
