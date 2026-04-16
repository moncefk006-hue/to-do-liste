/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar, Sun, Moon, Check } from 'lucide-react';
import { Task, FilterType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todos', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  // Apply dark mode to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add a new task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      dueDate: dueDate || undefined,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
    setDueDate('');
  };

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Derived filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.completed);
      case 'completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#121212] flex flex-col items-center justify-center font-sans text-[#333333] dark:text-[#e0e0e0] font-['Helvetica_Neue',Arial,sans-serif] p-4 transition-colors duration-500">
      <div className="w-full max-w-[520px] bg-white dark:bg-[#1e1e1e] p-[40px] rounded-[24px] shadow-lg dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[#e5e5e5] dark:border-[#333333] flex flex-col max-h-[85vh] transition-all duration-500">
        
        {/* Header */}
        <header className="flex items-start justify-between mb-[32px]">
          <div>
            <p className="text-[14px] text-[#888888] dark:text-[#a0a0a0] uppercase tracking-[1px] mb-1 transition-colors duration-500">Productivity Tool</p>
            <h1 className="text-[32px] font-bold tracking-[-1px] mb-[8px] bg-gradient-to-r from-[#111111] to-[#888888] dark:from-[#ffffff] dark:to-[#888888] bg-clip-text text-transparent transition-colors duration-500">
              Tasks
            </h1>
            <p className="text-[14px] text-[#666666] dark:text-[#a0a0a0] mt-1 transition-colors duration-500">
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] text-[#888888] dark:text-[#a0a0a0] transition-colors duration-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Input area */}
        <form onSubmit={addTask} className="relative mb-[24px] flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full py-[16px] pl-[20px] pr-[60px] bg-[#f9f9f9] dark:bg-[#252525] border border-[#e5e5e5] dark:border-[#333333] rounded-[12px] text-[#111111] dark:text-[#e0e0e0] text-[16px] outline-none focus:border-[#8b5cf6] dark:focus:border-[#bb86fc] transition-colors duration-500 placeholder:text-[#999999] dark:placeholder:text-[#a0a0a0]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-[8px] top-[8px] bottom-[8px] w-[44px] bg-[#8b5cf6] dark:bg-[#bb86fc] rounded-[8px] text-white dark:text-[#121212] flex items-center justify-center font-bold transition-all duration-300 hover:bg-[#7c3aed] dark:hover:bg-[#c99cfc] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
          <div className="relative w-max">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-[16px] py-[8px] bg-[#f9f9f9] dark:bg-[#252525] border border-[#e5e5e5] dark:border-[#333333] rounded-[12px] text-[#666666] dark:text-[#a0a0a0] text-[14px] outline-none focus:border-[#8b5cf6] dark:focus:border-[#bb86fc] transition-colors duration-500 cursor-pointer"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-[12px] mb-[24px] overflow-x-auto pb-1">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[16px] py-[8px] rounded-[20px] text-[13px] capitalize whitespace-nowrap transition-all duration-300 border ${
                filter === f
                  ? 'bg-[#f3e8ff] dark:bg-[rgba(187,134,252,0.1)] text-[#8b5cf6] dark:text-[#bb86fc] border-[#8b5cf6] dark:border-[#bb86fc]'
                  : 'bg-[#f0f0f0] dark:bg-[#2c2c2c] text-[#666666] dark:text-[#a0a0a0] border-transparent hover:bg-[#e5e5e5] dark:hover:bg-[#333333]'
              }`}
            >
              {f === 'all' ? 'All Tasks' : f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-[12px] overflow-y-auto pr-2 flex-hidden-scrollbar min-h-[50px] flex-1">
          <ul className="flex flex-col gap-[12px] m-0 p-0">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#999999] dark:text-[#a0a0a0] py-8 transition-colors duration-500"
                >
                  <p>No tasks found.</p>
                </motion.li>
              ) : (
                filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center p-[16px] bg-[#fdfdfd] dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] border border-[#f0f0f0] dark:border-[rgba(255,255,255,0.05)] group transition-colors duration-500"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-[22px] h-[22px] rounded-[6px] border-[2px] mr-[16px] flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-[#018786] border-[#018786] dark:bg-[#03dac6] dark:border-[#03dac6] text-white dark:text-[#121212]'
                          : 'border-[#cccccc] dark:border-[#333333] hover:border-[#888888] dark:hover:border-[#666666]'
                      }`}
                    >
                      <AnimatePresence>
                        {task.completed && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={14} strokeWidth={4} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                    <div className="flex-grow min-w-0 overflow-hidden text-left">
                      <div className={`text-[15px] mb-[4px] truncate transition-all duration-500 ${task.completed ? 'text-[#999999] dark:text-[#a0a0a0] line-through' : 'text-[#111111] dark:text-[#e0e0e0]'}`}>
                        {task.text}
                      </div>
                      <div className="text-[11px] text-[#888888] dark:text-[#a0a0a0] flex gap-[12px] transition-colors duration-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                          </span>
                        )}
                        <span>• Task</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-[#b00020] dark:text-[#cf6679] opacity-40 hover:opacity-100 transition-opacity ml-[16px] flex-shrink-0 p-2 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        </div>

        {/* Footer Stats block mapped to theme layout */}
        <div className="mt-[32px] pt-[24px] border-t border-[#e5e5e5] dark:border-[#333333] flex justify-between items-center text-[12px] text-[#888888] dark:text-[#a0a0a0] transition-colors duration-500">
          <div>
            <span>{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</span>
          </div>
          <div className="flex items-center gap-[12px]">
            <span>Progress: {tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</span>
            <div className="w-[100px] h-[4px] bg-[#e5e5e5] dark:bg-[#333333] rounded-[2px] overflow-hidden transition-colors duration-500">
              <div 
                className="h-full bg-[#018786] dark:bg-[#03dac6] rounded-[2px] transition-all duration-500 ease-out" 
                style={{ width: `${tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Creator Footer - Personal touch */}
      <footer className="mt-8 text-center text-[13px] text-[#888888] dark:text-[#666666] transition-colors duration-500">
        <p className="mb-1 font-medium">© {new Date().getFullYear()} • Created with ❤️</p>
        <p>
          Say hi on Instagram:{' '}
          <a
            href="https://instagram.com/hype_moncef"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8b5cf6] dark:text-[#bb86fc] hover:underline transition-all font-bold tracking-wide"
          >
            @hype_moncef
          </a>
        </p>
      </footer>
    </div>
  );
}
