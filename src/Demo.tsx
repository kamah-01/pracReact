import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, fetchTodos } from './api/index';
import TodoCard from "./components/todoCard";
import { useState } from "react";

export default function Demo() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");

    const {data: todos,isLoading } = useQuery({
        queryFn: () => fetchTodos(search),
        queryKey: ["todos", { search }],
        staleTime: Infinity,
        cacheTime: 0,
    });

    const { mutateAsync: addTodoMutation } = useMutation({
        mutationFn: addTodo, 
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });

    if (isLoading) {
        return <div>Loading</div>
    }
  return (
      <div>
          <div>
              <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
              <button onClick={async () => {
                  try {
                      await addTodoMutation({ title });
                      setTitle("");
                  } catch (e) {
                      console.error(e);
                  }
              }}>   Add Todo</button>
          </div>
          {todos?.map((todo) => {
              return <TodoCard key={todo.id} todo={todo} />; 
      })}
    </div>
  )
}

