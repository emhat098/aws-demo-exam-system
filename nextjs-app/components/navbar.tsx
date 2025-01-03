import { Suspense } from "react";
import UserAvatar from "./user-avatar";
import { Spin } from "antd";

export default function Navbar() {

  return (
    <nav className="flex justify-between gap-2 items-center p-4 container mx-auto border-b">
      <span className="text-2xl font-mono">AWS</span>
      <div>
        <Suspense fallback={<Spin size="small" />}>
          <UserAvatar />
        </Suspense>
      </div>
    </nav>
  );
}
