import { useRouter } from "next/router";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

const secret = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key";

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = ["/auth", "/login", "/register"];
    const token = localStorage.getItem("authToken");

    if (!publicRoutes.includes(router.pathname)) {
      if (!token || !jwt.verify(token, secret)) {
        router.push("/auth"); // Redirect to auth if not authenticated
      }
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
