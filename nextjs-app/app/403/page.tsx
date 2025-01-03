'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = 'force-static';

export default function NotAllowed() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (window) {
        window.location.href = '/';
      } else {
        router.push('/');
      }
    }, 3000)
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className={"flex flex-col items-center gap-3"}>
        <h1 className={"text-2xl"}>You are not allow access to this page</h1>
        <h2 className={"text-lg"}>Page is automatically redirect to home page in 3s.</h2>
      </div>
    </div>
  );
}
  