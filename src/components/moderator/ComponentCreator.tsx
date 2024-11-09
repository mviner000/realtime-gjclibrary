"use client";

import { useState, KeyboardEvent } from "react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

export const ComponentCreator = () => {
  const [componentName, setComponentName] = useState("");
  const createStyle = useMutation(api.queries.createComponentStyle);

  const handleCreate = async () => {
    if (!componentName) return;
    
    await createStyle({
      componentName,
      tailwindClasses: "// Add your Tailwind classes here",
    });
    
    setComponentName("");
    window.location.reload();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Component name (e.g., button, navbar)"
        value={componentName}
        onChange={(e) => setComponentName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        onClick={handleCreate}
        className="w-full"
      >
        Create Component
      </Button>
    </div>
  );
};