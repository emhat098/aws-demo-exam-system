import Link from "next/link";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { userSession } from "@/lib/user-session";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <a href="/api/auth/logout">{"Log out"}</a>,
  },
];

const UserAvatar = async () => {
  const session = await userSession();

  return (
    <div className={"flex gap-2 items-center"}>
      {session === null ? (
        <Link href="/api/auth/login" className="text-xs">
          Login
        </Link>
      ) : (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className={"cursor-pointer"}
        >
          <div className={"flex items-center gap-2"}>
            <Avatar
              src={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session?.user?.picture}
                  alt="avatar"
                  height={50}
                  width={50}
                />
              }
            />
            <Space>
              <span className={"text-xs"}>
                {session?.user.nickname ?? session?.user.name}
              </span>
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      )}
    </div>
  );
};

export default UserAvatar;
