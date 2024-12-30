export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className={"flex flex-col items-center gap-3"}>
        <h1 className={"text-2xl"}>Home page</h1>
        <hr className={"w-full"} />
        <p>
          Demo AWS + Auth0 + React (Next.js) + Ant Design + DynamoDB + API
          Gateway + SNS + SQS
        </p>
      </div>
    </div>
  );
}
