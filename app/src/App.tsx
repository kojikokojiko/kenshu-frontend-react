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
    </div>
  );
};
