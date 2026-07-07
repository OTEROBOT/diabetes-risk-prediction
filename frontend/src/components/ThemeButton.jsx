// src/components/ThemeButton.jsx
import { useState } from "react";

function ThemeButton() {
  // 1. ดึงค่าเริ่มต้นจาก localStorage หรือ System Preference ตั้งแต่สร้าง State (Lazy Initialization)
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    // ตั้งค่า Class ที่ <html> ทันทีตั้งแต่เริ่มระบบ เพื่อป้องกันหน้าจอขาววาบ (Flash of unstyled content)
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    return isDark;
  });

  // 2. ฟังก์ชันสลับธีมเมื่อคลิกปุ่ม
  const toggleTheme = () => {
    const newDark = !dark;

    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setDark(newDark);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "rgba(255,255,255,0.2)",
        border: "none",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
      }}
      title={dark ? "โหมดสว่าง" : "โหมดมืด"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeButton;