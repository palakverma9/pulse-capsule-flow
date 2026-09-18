import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type Goal = "dsa" | "placement" | "midsem" | "internship" | "free";

type Task = {
  id: string;
  text: string;
  goal: Goal;
  done: boolean;
};

type TimeBlock = {
  id: string;
  start: string;
  end: string;
  label: string;
  tasks: Task[];
};

type PulseState = {
  blocks: TimeBlock[];
  completionHistory: Record<string, number>;
};

const STORAGE_KEY = "pulse-state-v1";
const GOALS: Goal[] = ["dsa", "placement", "midsem", "internship", "free"];

const SAMPLE_BLOCKS: TimeBlock[] = [
  {
    id: "dsa-block",
    start: "12:00",
    end: "14:00",
    label: "dsa",
    tasks: [
      { id: "dsa-1", text: "solve two array problems", goal: "dsa", done: false },
      { id: "dsa-2", text: "review sliding window notes", goal: "dsa", done: false },
    ],
  },
  {
    id: "apply-block",
    start: "14:00",
    end: "15:00",
    label: "apply",
    tasks: [
      { id: "apply-1", text: "tailor resume for one role", goal: "placement", done: false },
      { id: "apply-2", text: "send one thoughtful application", goal: "placement", done: false },
    ],
  },
  {
    id: "study-block",
    start: "15:00",
    end: "17:00",
    label: "study",
    tasks: [
      { id: "study-1", text: "finish operating systems chapter", goal: "midsem", done: false },
      { id: "study-2", text: "make a one-page revision sheet", goal: "midsem", done: false },
    ],
  },
  {
    id: "internship-block",
    start: "17:00",
    end: "18:00",
    label: "internship",
    tasks: [
      { id: "internship-1", text: "write the daily progress note", goal: "internship", done: false },
      { id: "internship-2", text: "prepare tomorrow’s priorities", goal: "internship", done: false },
    ],
  },
];

const INITIAL_BLOCK_ID = "dsa-block";

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesFromTime(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function formatTime(time: string) {
  const [hours = "0", minutes = "00"] = time.split(":");
  const numericHour = Number(hours);
  const displayHour = numericHour % 12 || 12;
  return minutes === "00" ? `${displayHour}` : `${displayHour}:${minutes}`;
}

function blockLabel(block: TimeBlock) {
  return `${formatTime(block.start)}–${formatTime(block.end)} · ${block.label}`;
}

function calculateStreak(history: Record<string, number>, today: Date) {
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if ((history[localDateKey(cursor)] ?? 0) < 70) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while ((history[localDateKey(cursor)] ?? 0) >= 70) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "pulse — daily focus" },
      { name: "description", content: "A calm, time-blocked daily productivity space." },
      { property: "og:title", content: "pulse — daily focus" },
      { property: "og:description", content: "A calm, time-blocked daily productivity space." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pulse,
});

function Pulse() {
  const [blocks, setBlocks] = useState<TimeBlock[]>(SAMPLE_BLOCKS);
  const [selectedId, setSelectedId] = useState(INITIAL_BLOCK_ID);
  const [completionHistory, setCompletionHistory] = useState<Record<string, number>>({});
  const [now, setNow] = useState<Date | null>(null);
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newGoal, setNewGoal] = useState<Goal>("dsa");
  const [heroLeaving, setHeroLeaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const current = new Date();
    setNow(current);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PulseState;
        if (Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
          setBlocks(parsed.blocks);
          const firstStoredBlock = parsed.blocks[0];
          if (firstStoredBlock) setSelectedId(firstStoredBlock.id);
          setCompletionHistory(parsed.completionHistory ?? {});
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const totalTasks = blocks.reduce((sum, block) => sum + block.tasks.length, 0);
  const completedTasks = blocks.reduce(
    (sum, block) => sum + block.tasks.filter((task) => task.done).length,
    0,
  );
  const completion = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  useEffect(() => {
    if (!ready || !now) return;
    const nextHistory = { ...completionHistory, [localDateKey(now)]: completion };
    setCompletionHistory(nextHistory);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ blocks, completionHistory: nextHistory } satisfies PulseState),
    );
    // completionHistory is intentionally derived and written with the current task state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, completion, ready, now?.getDate()]);

  const currentBlock = useMemo(() => {
    if (!now) return undefined;
    const minute = now.getHours() * 60 + now.getMinutes();
    return blocks.find(
      (block) => minute >= minutesFromTime(block.start) && minute < minutesFromTime(block.end),
    );
  }, [blocks, now]);

  const currentTask = currentBlock?.tasks.find((task) => !task.done);
  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? blocks[0];
  const streak = now ? calculateStreak(completionHistory, now) : 0;
  const dateLabel = now
    ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }).toLowerCase()
    : "today";

  function updateBlock(blockId: string, update: (block: TimeBlock) => TimeBlock) {
    setBlocks((current) => current.map((block) => (block.id === blockId ? update(block) : block)));
  }

  function toggleTask(blockId: string, taskId: string) {
    updateBlock(blockId, (block) => ({
      ...block,
      tasks: block.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    }));
  }

  function completeHeroTask() {
    if (!currentBlock || !currentTask || heroLeaving) return;
    setHeroLeaving(true);
    window.setTimeout(() => {
      toggleTask(currentBlock.id, currentTask.id);
      setHeroLeaving(false);
    }, 220);
  }

  function addTask() {
    const text = newTask.trim();
    if (!selectedBlock || !text) return;
    updateBlock(selectedBlock.id, (block) => ({
      ...block,
      tasks: [
        ...block.tasks,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, goal: newGoal, done: false },
      ],
    }));
    setNewTask("");
  }

  return (
    <main className="pulse-page">
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-three" aria-hidden="true" />

      <section className="pulse-shell" aria-label="pulse daily planner">
        <div className="portal-window" aria-hidden="true">
          <div className="portal-glow" />
        </div>

        <div className="pulse-content">
          <header className="pulse-header">
            <h1>pulse</h1>
            <time>{dateLabel}</time>
          </header>

          <section className="glass-card right-now" aria-labelledby="right-now-label">
            <p id="right-now-label" className="eyebrow">
              {currentBlock ? blockLabel(currentBlock) : "right now"}
            </p>
            {!currentBlock ? (
              <p className="empty-state">no active block</p>
            ) : !currentTask ? (
              <p className="empty-state">all clear ✦</p>
            ) : (
              <div className={`hero-task ${heroLeaving ? "hero-task-leaving" : ""}`}>
                <p>{currentTask.text}</p>
                <div className="hero-task-footer">
                  <span className="goal-tag">{currentTask.goal}</span>
                  <button type="button" className="done-button" onClick={completeHeroTask}>
                    done ✦
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="blocks-section" aria-labelledby="blocks-heading">
            <h2 id="blocks-heading">today’s blocks</h2>
            <div className="block-scroll">
              {blocks.map((block) => {
                const isCurrent = block.id === currentBlock?.id;
                const isComplete = block.tasks.length > 0 && block.tasks.every((task) => task.done);
                return (
                  <button
                    key={block.id}
                    type="button"
                    className={`block-pill ${isCurrent ? "block-pill-current" : ""} ${
                      isComplete ? "block-pill-complete" : ""
                    } ${selectedBlock?.id === block.id ? "block-pill-selected" : ""}`}
                    onClick={() => {
                      setSelectedId(block.id);
                      setEditingId((current) => (current === block.id ? null : block.id));
                    }}
                    aria-pressed={selectedBlock?.id === block.id}
                  >
                    <span className="time-text">{formatTime(block.start)}–{formatTime(block.end)}</span>
                    <span> · {block.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedBlock && (
            <section className="glass-card task-card" aria-label={`${selectedBlock.label} tasks`}>
              {editingId === selectedBlock.id && (
                <div className="block-editor">
                  <label>
                    <span>start</span>
                    <input
                      type="time"
                      value={selectedBlock.start}
                      onChange={(event) =>
                        updateBlock(selectedBlock.id, (block) => ({ ...block, start: event.target.value }))
                      }
                    />
                  </label>
                  <span aria-hidden="true">→</span>
                  <label>
                    <span>end</span>
                    <input
                      type="time"
                      value={selectedBlock.end}
                      onChange={(event) =>
                        updateBlock(selectedBlock.id, (block) => ({ ...block, end: event.target.value }))
                      }
                    />
                  </label>
                  <label className="label-field">
                    <span>label</span>
                    <input
                      value={selectedBlock.label}
                      maxLength={16}
                      onChange={(event) =>
                        updateBlock(selectedBlock.id, (block) => ({
                          ...block,
                          label: event.target.value.toLowerCase(),
                        }))
                      }
                    />
                  </label>
                  <button type="button" className="editor-done" onClick={() => setEditingId(null)}>
                    done
                  </button>
                </div>
              )}

              <div className="task-list">
                {selectedBlock.tasks.map((task) => (
                  <div key={task.id} className={`task-row ${task.done ? "task-row-done" : ""}`}>
                    <button
                      type="button"
                      className="task-toggle"
                      onClick={() => toggleTask(selectedBlock.id, task.id)}
                      aria-label={`${task.done ? "mark undone" : "mark done"}: ${task.text}`}
                    >
                      {task.done ? "●" : "○"}
                    </button>
                    <span className="task-name">{task.text}</span>
                    <span className="goal-tag">{task.goal}</span>
                  </div>
                ))}
              </div>

              <form
                className="add-task-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  addTask();
                }}
              >
                <input
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value.toLowerCase())}
                  placeholder="+ add task"
                  aria-label="add task"
                />
                <select
                  value={newGoal}
                  onChange={(event) => setNewGoal(event.target.value as Goal)}
                  aria-label="goal tag"
                >
                  {GOALS.map((goal) => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </form>
            </section>
          )}

          <footer className="pulse-footer">
            <div className="progress-meta">
              <span>daily rhythm</span>
              <span className="time-text">{completion}%</span>
            </div>
            <progress max="100" value={completion} aria-label={`${completion}% complete`} />
            <p>✦ {streak} {streak === 1 ? "day" : "days"}</p>
          </footer>
        </div>
      </section>
    </main>
  );
}