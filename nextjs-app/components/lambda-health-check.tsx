import { getAccessToken } from "@auth0/nextjs-auth0";
import { Alert } from "antd";

type LambdaStatus = {
  status: "success" | "info" | "warning" | "error";
  message: string;
};

if (!process.env.LAMBDA_API_URL) {
  throw new Error("LAMBDA_API_URL variable is not set up.");
}

const checkStatus = async (): Promise<LambdaStatus> => {
  const token = await getAccessToken();

  if (!token)
    return {
      message: "Not logged in",
      status: "error",
    };

  const res = await fetch(
    `${process.env.LAMBDA_API_URL as string}/hello-world`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  if (res.ok) {
    return {
      message: "Lambda is connected",
      status: "success",
    };
  }

  return {
    message: res.statusText,
    status: "warning",
  };
};

const LambdaHealthCheck = async () => {
  const { status, message } = await checkStatus();

  return (
    <Alert
      message={message}
      type={status}
      className={"!rounded-none !py-1 !text-xs !font-medium"}
    />
  );
};

export default LambdaHealthCheck;
