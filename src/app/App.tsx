import { useState } from "react";
import {
  ThemeProvider,
  SidebarNavigation,
  SidebarButton,
  Avatar,
  Button,
  IconButton,
  InputField,
  Badge,
  Tooltip,
} from "@figma/astraui";
import {
  Home,
  Film,
  Book,
  Folder,
  Settings,
  Plus,
  Trash2,
  Check,
  CheckCircle,
} from "lucide-react";

type Filter = "all" | "active" | "done";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: "Read the AstraUI kit guidelines", done: true },
  { id: 2, text: "Connect the GitHub MCP server", done: true },
  { id: 3, text: "Create a new repo called FlowMake", done: false },
  { id: 4, text: "Ship something with Figma Make", done: false },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed, done: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const visible = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = todos.filter((t) => t.done).length;
  const activeCount = todos.filter((t) => !t.done).length;

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        {/* MARKER-MAKE-KIT-INVOKED */}
        {/* MARKER-MAKE-KIT-DISCOVERY-READ */}
        {/* MARKER-MAKE-KIT-TOKENS-READ */}

        <SidebarNavigation
          footer={
            <>
              <SidebarButton icon={<Settings className="size-full" strokeWidth={1.5} />} />
              <Avatar type="initial" initials="FM" size="medium" shape="circle" />
            </>
          }
        >
          <SidebarButton icon={<Home className="size-full" strokeWidth={1.5} />} active />
          <SidebarButton icon={<Film className="size-full" strokeWidth={1.5} />} />
          <SidebarButton icon={<Book className="size-full" strokeWidth={1.5} />} />
          <SidebarButton icon={<Folder className="size-full" strokeWidth={1.5} />} />
        </SidebarNavigation>

        <main className="flex-1 bg-brand-tertiary p-2xl overflow-y-auto">
          {/* Page header */}
          <div className="mb-xl">
            <h1 className="text-title text-text-primary">FlowMake</h1>
            <p className="text-label-sm text-text-secondary mt-xs">
              A simple todo demo — built with Figma Make + GitHub connector + AstraUI kit
            </p>
          </div>

          <div className="flex flex-col gap-xl w-full">
            {/* Add todo card */}
            <div className="bg-surface-bg rounded-corner-lg p-xl">
              <h2 className="text-label text-text-primary font-semibold mb-lg">
                New task
              </h2>
              <div className="flex gap-lg items-end">
                <div className="flex-1">
                  <InputField
                    placeholder="What needs to be done?"
                    value={input}
                    onChange={(val) => setInput(val)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") addTodo();
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  iconStart={<Plus size={16} />}
                  onClick={addTodo}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Filter + stats card */}
            <div className="bg-surface-bg rounded-corner-lg p-xl">
              <div className="flex items-center justify-between mb-lg">
                <div className="flex gap-sm">
                  <Button
                    variant={filter === "all" ? "primary" : "neutral"}
                    size="small"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "primary" : "neutral"}
                    size="small"
                    onClick={() => setFilter("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "done" ? "primary" : "neutral"}
                    size="small"
                    onClick={() => setFilter("done")}
                  >
                    Done
                  </Button>
                </div>

                <div className="flex items-center gap-md">
                  <Badge label={`${activeCount} left`} variant="default" />
                  {doneCount > 0 && (
                    <Button variant="subtle" size="small" onClick={clearDone}>
                      Clear done
                    </Button>
                  )}
                </div>
              </div>

              {/* Todo list */}
              {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-2xl gap-md">
                  <CheckCircle size={32} className="text-text-tertiary" />
                  <p className="text-label-sm text-text-tertiary">
                    {filter === "done"
                      ? "No completed tasks yet"
                      : filter === "active"
                      ? "All caught up!"
                      : "Add your first task above"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {visible.map((todo, idx) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-md py-md group ${
                        idx < visible.length - 1
                          ? "border-b border-border-secondary"
                          : ""
                      }`}
                    >
                      {/* using raw <button>: kit Checkbox is uncontrolled-only (defaultChecked) and cannot reflect toggled state */}
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="flex-shrink-0 w-5 h-5 rounded-corner-sm flex items-center justify-center transition-colors"
                        style={{
                          background: todo.done ? "var(--brand-primary)" : "transparent",
                          border: todo.done ? "none" : "2px solid var(--border-primary)",
                        }}
                        aria-label={todo.done ? "Mark incomplete" : "Mark complete"}
                      >
                        {todo.done && <Check size={12} color="white" strokeWidth={3} />}
                      </button>

                      <span
                        className={`flex-1 text-label ${
                          todo.done ? "text-text-tertiary line-through" : "text-text-primary"
                        }`}
                      >
                        {todo.text}
                      </span>

                      {todo.done && <Badge label="Done" variant="success" />}

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Delete task" position="top">
                          <IconButton
                            icon={<Trash2 size={14} />}
                            variant="subtle"
                            size="small"
                            onClick={() => deleteTodo(todo.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress card */}
            {todos.length > 0 && (
              <div className="bg-surface-bg rounded-corner-lg p-xl">
                <div className="flex items-center justify-between mb-lg">
                  <h2 className="text-label text-text-primary font-semibold">Progress</h2>
                  <span className="text-label-sm text-text-secondary">
                    {doneCount} of {todos.length} complete
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-subtle overflow-hidden">
                  <div
                    className="h-full bg-brand-primary rounded-full transition-all duration-500"
                    style={{ width: `${(doneCount / todos.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
