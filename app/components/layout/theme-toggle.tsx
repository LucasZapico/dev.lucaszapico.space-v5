import { useEffect, useState } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <IoSunny className="h-4 w-4" /> : <IoMoon className="h-4 w-4" />}
    </Button>
  );
}
