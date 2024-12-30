import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { Avatar, Dropdown, Space } from "antd";
import Image from "next/image";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export default function Navbar() {
  return (
    <nav className="flex justify-between gap-2 items-center p-4 container mx-auto border-b">
      <span className="text-2xl font-mono">AWS</span>
      <UserAvatar />
    </nav>
  );
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <a href="/api/auth/logout">{"Log out"}</a>,
  },
];

const UserAvatar = async () => {
  const [session] = await Promise.allSettled([await getSession()]);

  return (
    <div className={"flex gap-2 items-center"}>
      {session.status === "rejected" || session.value === null ? (
        <Link href="/api/auth/login" className="text-xs">
          Login
        </Link>
      ) : (
        <Dropdown menu={{ items }}>
          <div className={"flex items-center gap-2"}>
            <Avatar
              src={
                <Image
                  src={session.value?.user.picture}
                  alt="avatar"
                  height={50}
                  width={50}
                />
              }
            />
            <Space>
              <span className={"text-xs"}>
                {session.value?.user.nickname ?? session.value?.user.name}
              </span>
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      )}
    </div>
  );
};
