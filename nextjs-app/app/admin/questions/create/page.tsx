import userToken from "@/lib/user-token";
import { Question } from "@/types/question";
import { Button, Input } from "antd";
import { redirect } from "next/navigation";

const createQuestion = async (data: Question): Promise<boolean | undefined> => {
  try {
    const token = await userToken();

    const res = await fetch(
      `${process.env.LAMBDA_API_URL as string}/create-question`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res);

    return res.ok;
  } catch (error) {
    console.log(error);
  }
};

export default function Page() {
  const onAction = async (formData: FormData) => {
    "use server";
    const data: Question = {
      question_text: formData.get("question_text") as string,
      question_type: formData.get("question_type") as string,
      question_answer: formData.get("question_answer") as string,
    };

    const result = await createQuestion(data);
    if (result) {
      return redirect("/admin/questions");
    } else {
      console.error("Question creation failed.", result);
    }
  };

  return (
    <div className={"w-full md:w-[50%]"}>
      <h1>Create question</h1>
      <hr className={"my-4"} />
      <form action={onAction} className={"flex flex-col gap-2"}>
        <div className="flex gap-2">
          <label
            htmlFor={"question_text"}
            className={"max-w-max min-w-28 w-full"}
          >
            Question Text:
          </label>
          <Input name={"question_text"} id={"question_text"} />
        </div>
        <div className="flex gap-2">
          <label
            htmlFor="question_type"
            className={"max-w-max min-w-28 w-full"}
          >
            Question Type
          </label>
          <select
            id="question_type"
            name="question_type"
            defaultValue={"yes_no"}
          >
            <option value={"yes_no"}>yes/no</option>
          </select>
        </div>
        <div className="flex gap-2">
          <label
            htmlFor={"question_answer"}
            className={"max-w-max min-w-28 w-full"}
          >
            Answer:
          </label>
          <Input name={"question_answer"} id={"question_answer"} />
        </div>
        <div className="w-full">
          <Button htmlType={"submit"} type={"primary"} className={"max-w-28"}>
            Submit
          </Button>
          <Button type={"link"} className={"max-w-28"} href="/admin/questions">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
