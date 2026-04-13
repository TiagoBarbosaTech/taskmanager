import { useEffect, useState } from "react";

type Task = {
    text: string;
    completed: boolean;
};

type Filter = "all" | "active" | "completed";

function App() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [filter, setFilter] = useState<Filter>("all");

    useEffect(() => {
        const saved = localStorage.getItem("tasks");
        if (saved) setTasks(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function addTask() {
        if (!task.trim()) return;

        if (editIndex !== null) {
            const updated = [...tasks];
            updated[editIndex].text = task;
            setTasks(updated);
            setEditIndex(null);
        } else {
            setTasks([...tasks, { text: task, completed: false }]);
        }

        setTask("");
    }

    function toggleTask(index: number) {
        const updated = [...tasks];
        updated[index].completed = !updated[index].completed;
        setTasks(updated);
    }

    function deleteTask(index: number) {
        setTasks(tasks.filter((_, i) => i !== index));
    }

    function startEdit(index: number) {
        setTask(tasks[index].text);
        setEditIndex(index);
    }

    const filteredTasks = tasks.filter((item) => {
        if (filter === "active") return !item.completed;
        if (filter === "completed") return item.completed;
        return true;
    });

    const btn = {
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f8",
                padding: "40px",
                fontFamily: "Arial"
            }}
        >
            <div
                style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    background: "white",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >
                <h1 style={{ marginBottom: "5px" }}>Task Manager</h1>
                <p style={{ color: "#666", marginBottom: "30px" }}>
                    Organize your daily work efficiently.
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="New task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <button
                        onClick={addTask}
                        style={{ ...btn, background: "#111", color: "white" }}
                    >
                        {editIndex !== null ? "Save" : "Add"}
                    </button>
                </div>

                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button onClick={() => setFilter("all")} style={btn}>All</button>
                    <button onClick={() => setFilter("active")} style={btn}>Active</button>
                    <button onClick={() => setFilter("completed")} style={btn}>Completed</button>
                </div>

                <div style={{ marginTop: "30px" }}>
                    {filteredTasks.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "14px",
                                border: "1px solid #eee",
                                borderRadius: "10px",
                                marginBottom: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <span
                                onClick={() => toggleTask(index)}
                                style={{
                                    flex: 1,
                                    cursor: "pointer",
                                    textDecoration: item.completed ? "line-through" : "none",
                                    color: item.completed ? "#888" : "#111"
                                }}
                            >
                                {item.text}
                            </span>

                            <button onClick={() => startEdit(index)} style={btn}>
                                Edit
                            </button>

                            <button
                                onClick={() => deleteTask(index)}
                                style={{ ...btn, background: "#e53935", color: "white" }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;