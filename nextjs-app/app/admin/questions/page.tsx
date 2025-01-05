/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { Button, Spin } from "antd";

import userToken from "@/lib/user-token";
import Table, { QuestionTableProps } from "./components/table";

const getQuestions = async (
  limit = 1,
  currentPage = 1,
  pageToken?: string
): Promise<QuestionTableProps | undefined> => {
  try {
    const token = await userToken();
    let url = `${process.env.LAMBDA_API_URL}/questions?limit=${limit}&current_page=${currentPage}`;
    if (pageToken) url += `&page_token=${encodeURIComponent(pageToken)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = await res.json();
    return data as QuestionTableProps;
  } catch (error) {
    console.log(error);
  }
};

export default async function QuestionsPage({ searchParams }: any) {
  const sParams = await searchParams;

  const limit = Number(sParams?.limit || 1);
  const pageToken = sParams?.page_token;
  const currentPage = Number(sParams?.current_page || 1);

  const [dataQuestions] = await Promise.allSettled([
    await getQuestions(limit, currentPage, pageToken),
  ]);

  if (dataQuestions.status === "fulfilled" && dataQuestions.value) {
    const { questions, pagination } = dataQuestions.value;

    return (
      <div className="container mx-auto">
        <div className={"flex flex-col gap-3"}>
          <h1 className={"text-2xl"}>Question page</h1>
          <hr />
          <Button href="/admin/questions/create" className={"w-max"}>
            Create
          </Button>
          <Suspense fallback={<Spin />}>
            <Table pagination={pagination} questions={questions} />;
          </Suspense>
        </div>
      </div>
    );
  }

  return <div>No found data.</div>;
}
