import userToken from "@/lib/user-token";
import { Question } from "@/types/question";
import { getSession } from "@auth0/nextjs-auth0";
import { Button } from "antd";
import Message from "./message";
import { redirect } from "next/navigation";

const getQuestions = async (): Promise<Question[] | undefined> => {
  try {
    const token = await userToken();
    let url = `${process.env.LAMBDA_API_URL}/questions?limit=10&current_page=1`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = await res.json();
    return data.questions as Question[];
  } catch (error) {
    console.log(error);
  }
};

const submitExam = async (answers: any) => {
  const session = await getSession();
  const token = await userToken();
  const data = {
    student: session?.user.email,
    answers,
  };

  const res = await fetch(`${process.env.LAMBDA_API_URL}/submit-answer`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const body = await res.json();
  console.log(body, res);
  return res.ok;
};

const Questions = async () => {
  const questions = await getQuestions();

  if (!questions) {
    return <span>Something went wrong.</span>;
  }

  const formAction = async (formData: FormData) => {
    "use server";

    const result = await submitExam(Object.entries(formData.entries));

    if (result) {
      return redirect("/?answer=1");
    } else {
      console.error("Question creation failed.", result);
    }
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <Message />
      <form action={formAction} className={"flex flex-col gap-2"}>
        {questions &&
          questions.length > 0 &&
          questions.map((question) => (
            <div
              key={question.question_id}
              className={"flex flex-col gap-2 border px-4 py-2 rounded-lg"}
            >
              <div>{question.question_text}</div>
              {question.question_type === "yes_no" && (
                <div className={"flex flex-row gap-2"}>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name={question.question_id}
                      id={question.question_id}
                      value={"yes"}
                      required
                    />
                    <span>{"Yes"}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      name={question.question_id}
                      id={question.question_id}
                      value={"no"}
                      required
                    />
                    <span>{"No"}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        <div>
          <Button htmlType="submit" type="default">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Questions;
