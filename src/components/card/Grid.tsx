"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import EditorGrid from "./EditorGrid";
import CheckerGrid from "./CheckerGrid";
import ViewerGrid from "./ViewerGrid";
import AddGrid from "./AddGrid";

interface GridProps {
  mode?: "editor" | "checker" | "viewer" | "add";
}

const Grid: React.FC<GridProps> = ({ mode = "editor" }) => {
  const pathname = usePathname();
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (id && !isNaN(Number(id))) {
      setStudentId(id);
    }
  }, [pathname]);

  if (!studentId) {
    return <div>Loading...</div>;
  }

  switch (mode) {
    case "editor":
      return <EditorGrid studentId={studentId} mode={mode} />;
    case "checker":
      return <CheckerGrid studentId={studentId} mode={mode} />;
    case "add":
      return <AddGrid studentId={studentId} mode={mode} />;
    case "viewer":
    default:
      return <ViewerGrid studentId={studentId} mode={mode} />;
  }
};

export default Grid;
