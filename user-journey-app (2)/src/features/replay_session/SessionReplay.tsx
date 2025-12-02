import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Filter,
  Network,
  Clock,
} from "lucide-react";
import SessionGraph from "./SessionGraph";
import StatusPill from "../../components/StatusPill";

interface SessionReplayProps {
  isDarkMode?: boolean;
}

const SESSIONS = [
  {
    id: "sess_01",
    user: "test_user_1",
    time: "10:42 AM",
    duration: "4m 12s",
    events: 124,
    score: 92,
    status: "Completed",
  },
  {
    id: "sess_02",
    user: "test_user_1",
    time: "10:45 AM",
    duration: "1m 05s",
    events: 45,
    score: 35,
    status: "Dropped",
  },
  {
    id: "sess_03",
    user: "test_user_1",
    time: "10:48 AM",
    duration: "12m 30s",
    events: 512,
    score: 68,
    status: "Friction",
  },
  {
    id: "sess_04",
    user: "test_user_1",
    time: "11:02 AM",
    duration: "3m 22s",
    events: 88,
    score: 100,
    status: "Completed",
  },
];

const SessionReplay: React.FC<SessionReplayProps> = ({ isDarkMode = true }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSession, setSelectedSession] = useState(SESSIONS[0].id);
  const [progress, setProgress] = useState(35);

  return (
    <div className="flex flex-col min-h-[calc(100vh-128px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Session List */}
        <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl dark:shadow-none">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">
              Sessions
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              test_user_1 • {SESSIONS.length} sessions
            </p>
          </div>

          {/* Filter Bar */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex gap-2 bg-slate-50 dark:bg-slate-900">
            <input
              type="text"
              placeholder="Filter IP / User..."
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs w-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-cyan-500/50"
            />
            <button className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              <Filter size={14} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900">
            {SESSIONS.map((sess) => (
              <div
                key={sess.id}
                onClick={() => setSelectedSession(sess.id)}
                className={`p-4 border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${
                  selectedSession === sess.id
                    ? "bg-white dark:bg-slate-800/80 border-l-2 border-l-cyan-500"
                    : "border-l-2 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-200">
                    {sess.user}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      sess.status === "Completed"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : sess.status === "Dropped"
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {sess.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {sess.time}
                  </span>
                  <span>{sess.events} Events</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Graph Visualization */}
        <div className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950">
          {/* Toolbar Overlay */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex shadow-sm">
              <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <ZoomIn size={18} />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <ZoomOut size={18} />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 my-auto mx-1" />
              <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <Network size={18} />
              </button>
            </div>
          </div>

          {/* Legend Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                <span className="text-slate-600 dark:text-slate-300">
                  Applications (Layer 1)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                <span className="text-slate-600 dark:text-slate-300">
                  Navigation (Layer 2)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]" />
                <span className="text-slate-600 dark:text-slate-300">
                  Clicks (Layer 3)
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <SessionGraph isPlaying={isPlaying} isDarkMode={isDarkMode} />
          </div>

          {/* Bottom Timeline Controls */}
          <div className="h-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col px-6 py-3 z-20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg shadow-cyan-900/20"
                >
                  {isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>
                <div className="flex gap-1">
                  <button className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <SkipBack size={16} />
                  </button>
                  <button className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <SkipForward size={16} />
                  </button>
                </div>
                <span className="font-mono text-sm text-cyan-600 dark:text-cyan-400 font-bold">
                  01:42 / 04:12
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  1x Speed
                </span>
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="relative w-full h-8 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex items-center px-2 cursor-pointer group">
              {/* Event Markers */}
              <div className="absolute left-[10%] h-3 w-1 bg-cyan-500/50 rounded-full" />
              <div className="absolute left-[35%] h-3 w-1 bg-purple-500/50 rounded-full" />
              <div className="absolute left-[82%] h-3 w-1 bg-rose-500/80 rounded-full animate-pulse" />

              {/* Progress Bar */}
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 bottom-0 bg-cyan-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Scrubber Knob */}
              <div
                className="absolute w-3 h-3 bg-white rounded-full shadow-lg border-2 border-cyan-500 transform -translate-x-1.5"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReplay;
