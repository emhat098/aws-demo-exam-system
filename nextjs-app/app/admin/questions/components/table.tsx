"use client";

import { Question } from "@/types/question";
import { Table as AntTable } from "antd";
import type { TableProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface DataType {
  key: string;
  question_id: string;
  question_text: string;
  question_answer: string;
  question_type: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Id",
    dataIndex: "question_id",
    key: "question_id",
  },
  {
    title: "Text",
    dataIndex: "question_text",
    key: "question_text",
  },
  {
    title: "Answer",
    dataIndex: "question_answer",
    key: "question_answer",
  },
  {
    title: "Type",
    dataIndex: "question_type",
    key: "question_type",
  },
];

export interface QuestionTableProps {
  questions: Question[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    nextPageToken: string | null;
  };
}

const Table: FC<QuestionTableProps> = ({
  questions,
  pagination: { currentPage, nextPageToken, pageSize, totalItems, totalPages },
}) => {
  const router = useRouter();

  // Convert stored object back to a Map
  const getStoredPageTokens = () => {
    if (typeof window !== "undefined") {
      const storedTokens = localStorage.getItem("pageTokens");
      return storedTokens
        ? new Map(Object.entries(JSON.parse(storedTokens)))
        : new Map();
    }
    return new Map();
  };

  // Store pagination history in Map
  const [pageTokens, setPageTokens] = useState<any>(getStoredPageTokens);

  useEffect(() => {
    if (nextPageToken) {
      const updatedTokens = new Map(pageTokens);
      updatedTokens.set(currentPage, nextPageToken);

      // Convert Map to object before storing in localStorage
      localStorage.setItem(
        "pageTokens",
        JSON.stringify(Object.fromEntries(updatedTokens))
      );
      setPageTokens(updatedTokens);
    }
  }, [nextPageToken, currentPage]);

  return (
    <AntTable<DataType>
      columns={columns}
      rowKey={"question_id"}
      dataSource={questions as DataType[]}
      pagination={{
        pageSize: pageSize,
        current: currentPage,
        total: totalItems,
        defaultPageSize: totalPages,
        onChange: (page, pageSize) => {
          let url = `/admin/questions?limit=${pageSize}&current_page=${page}`;
          if (page > currentPage) {
            // Moving forward, use nextPageToken
            url += `&page_token=${encodeURIComponent(nextPageToken as string)}`;
          } else if (page < currentPage) {
            // Moving backward, use previous stored token
            url += `&page_token=${encodeURIComponent(pageTokens[page] || "")}`;
          }
          router.push(url);
        },
      }}
    />
  );
};

export default Table;
