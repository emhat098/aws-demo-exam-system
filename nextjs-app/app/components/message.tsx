"use client";

import { Alert } from "antd";
import { useSearchParams } from "next/navigation";

const Message = () => {
  const searchParams = useSearchParams();
  const answer = searchParams.get("answer") == "1";
  return (
    <Alert
      type={answer ? "success" : "error"}
      message={answer ? "Submitted the answer" : "Something went wrong"}
    />
  );
};

export default Message;
