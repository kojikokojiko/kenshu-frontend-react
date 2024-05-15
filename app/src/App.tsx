import { useQuery, useQueryClient } from "react-query";
import classNames from "./App.module.css";
import { useState } from "react";

const tasksURL = "http://localhost:8000/api/tasks";

interface Task {
  id: string;
  title: string;
  createdAt: string;
  finishedAt: string | null;
}

interface TasksResponse {
  tasks: Task[];
}

export const App: React.FC = () => {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const handleEditClick = (task) => {
    setEditId(task.id);
    setEditText(task.title);
  };

  const handleSave = async (id, title) => {
    // APIリクエストを送信してデータを更新
    const response = await fetch(`${tasksURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editText }), // editTextは編集された新しいタイトル
    });
    if (response.ok) {
      setEditId(null);
      setEditText("");
      queryClient.refetchQueries("tasks");
    } else {
      // エラーハンドリング
      console.error("Failed to update the task.");
    }
  };

  const handleDelete = async (id) => {
    // APIリクエストを送信してデータを更新
    const response = await fetch(`${tasksURL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      queryClient.refetchQueries("tasks");
    } else {
      // エラーハンドリング
      console.error("Failed to delete the task.");
    }
  };

  const handleChange = (e) => {
    setEditText(e.target.value);
  };

  // APIからタスクリストを取得する関数
  const fetchTasks = async (): Promise<TasksResponse> => {
    const response = await fetch(tasksURL); // APIのエンドポイントURLを指定
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery<TasksResponse, Error>(
    "tasks",
    fetchTasks
  );
  const queryClient = useQueryClient(); // QueryClientを取得

  const handlePostClick = async () => {
    try {
      const response = await fetch(tasksURL, {
        method: "POST", // HTTPメソッドとしてPOSTを指定
        headers: {
          "Content-Type": "application/json", // コンテンツタイプとしてJSONを指定
        },
      });

      console.log(response.status);

      if (!response.ok) {
        throw new Error("Failed to post the new task");
      }

      console.log("Posted successfully:", await response.text()); // レスポンスをテキストで表示
      queryClient.refetchQueries("tasks");
    } catch (error) {
      console.error("Error posting task:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tasks</h1>
      <ul className="pl-5">
        {data?.tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-5 ">
            {editId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={handleChange}
                className="flex-1 rounded border-gray-300 shadow-sm p-2 mr-4 text-gray-700"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSave(task.id, editText);
                  }
                }}
              />
            ) : (
              <span className="flex-1 text-gray-700">{task.title}</span>
            )}

            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
            >
              DELETE
            </button>

            {editId === task.id ? (
              <button
                onClick={() => handleSave(task.id, editText)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEditClick(task)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
              >
                Edit
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <button
          onClick={handlePostClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out"
        >
          POST
        </button>
      </div>
    </div>
  );
};
