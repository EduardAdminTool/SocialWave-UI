// hoc/withAuth.js

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null);
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
        return result.valid;
      } catch (error) {
        console.error("Token verification failed:", error.message);
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
        if (!isValidToken) {
          router.push("/auth/login");
        }
      };

      checkAuth();
    }, [router]);

    // Return the wrapped component with the user data as props
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
