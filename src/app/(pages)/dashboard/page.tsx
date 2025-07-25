// import { Suspense } from "react";
// import Dashboard from "@/src/views/Dashboard";

// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Dashboard />
//     </Suspense>
//   );
// }
// /app/dashboard/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/views/Dashboard";

export default async function Page() {
  const cookieStore = await cookies(); // ✅ Await because it's returning a Promise
  const token = cookieStore.get("id_token")?.value;

  if (!token) {
    redirect("/auth/sign-in");
  }

  return <Dashboard />;
}
