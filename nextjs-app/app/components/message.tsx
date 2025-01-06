"use client";

import { Alert } from "antd";
import { useSearchParams } from "next/navigation";

const Message = () => {
  const searchParams = useSearchParams();
  let answer = searchParams.get("answer") === "1";
  if (!answer) {
    return;
  }

  return (
    <Alert
      type={answer && "success"}
      message={answer && "Submitted the answer"}
    />
  );
};

export default Message;
