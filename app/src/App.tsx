import { useQuery, useQueryClient } from "react-query";
import classNames from "./App.module.css";

const TasksURL = "http://localhost:8000/api/tasks";

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
  // APIからタスクリストを取得する関数
  const fetchTasks = async (): Promise<TasksResponse> => {
    const response = await fetch(TasksURL); // APIのエンドポイントURLを指定
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
      const response = await fetch(TasksURL, {
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
    <div>
      <h1 className="font-bold">Tasks</h1>
      <ul>
        {data?.tasks.map((task) => (
          <li key={task.id}>
            {task.title} (Created at:{" "}
            {new Date(task.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
      <button
        onClick={handlePostClick}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        POST
      </button>
      <button
        onClick={handlePostClick}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        EDIT
      </button>
    </div>
  );
};
