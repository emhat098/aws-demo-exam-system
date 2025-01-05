import { Suspense } from "react";
import Questions from "./components/questions";
import { Spin } from "antd";

export default async function Home() {
  return (
    <div className="container mx-auto">
      <div className={"flex flex-col items-center gap-3"}>
        <h1 className={"text-2xl"}>Home page</h1>
        <hr className={"w-full"} />
        <p>
          Demo AWS + Auth0 + React (Next.js) + Ant Design + DynamoDB + API
          Gateway + SNS + SQS
        </p>
        <Suspense fallback={<Spin />}>
          <Questions />
        </Suspense>
      </div>
    </div>
  );
}
