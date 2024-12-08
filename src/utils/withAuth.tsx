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
        console.error("Token verification failed:", error);
        return false;
      }
    };

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const isValidToken = await verifyToken(token);
        if (isValidToken.message === "Invalid token") {
          localStorage.removeItem("authToken");
          router.push("/auth/login");
          return;
        }

        setLoading(false); // Set loading to false if the token is valid
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full page height
            width: "100vw", // Full page width
          }}
        >
          <div
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              borderTop: "4px solid #3498db",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
