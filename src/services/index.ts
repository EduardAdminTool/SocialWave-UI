export const verifyToken = async (token: any) => {
    try {
      const response = await fetch(
        "http://localhost:3001/auth/verify-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const result = await response.json();
      console.log("Token verification response:", result);

      return result;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };