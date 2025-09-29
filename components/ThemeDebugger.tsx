import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeDebugger() {
  const { theme, resolvedTheme } = useTheme();
  const [documentClass, setDocumentClass] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDocumentClass(document.documentElement.className);
    }
  }, [theme]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50">
      <div>Theme: {theme}</div>
      <div>Resolved: {resolvedTheme}</div>
      <div>HTML Classes: {documentClass}</div>
    </div>
  );
}
