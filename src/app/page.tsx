"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // const token = sessionStorage.getItem("id_token") || null;
    const token = Cookies.get("id_token");
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/sign-in");
    }
  }, [router]);

  return null;
}
