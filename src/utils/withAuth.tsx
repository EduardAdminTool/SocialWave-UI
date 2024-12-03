import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    const router = useRouter();

    const verifyToken = async (token) => {
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
        console.error("Token verification failed:", error.message);
        return false;
      }
    };

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("authToken");
        console.log("Token from localStorage:", token); // Debug token
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const isValidToken = await verifyToken(token);
        if (!isValidToken) {
          router.push("/auth/login");
          return;
        }

        setLoading(false); // Set loading to false if the token is valid
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Show a loader while verifying token
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
