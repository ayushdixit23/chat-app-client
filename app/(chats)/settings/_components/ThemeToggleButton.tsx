import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleButtonProps {
  onToggle: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ onToggle }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-full dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-200 hover:bg-gray-300`}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggleButton;
