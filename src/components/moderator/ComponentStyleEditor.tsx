"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ComponentStyleEditorProps {
  componentNames?: string[];
  showUpdateTime?: boolean;
  showEnterToSave?: boolean;
  readOnly?: boolean;
}

export const ComponentStyleEditor = ({
  componentNames,
  readOnly = false,
}: ComponentStyleEditorProps) => {
  const [activeTextarea, setActiveTextarea] = useState<Id<"componentStyles"> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const updateStyle = useMutation(api.queries.updateComponentStyle);
  const styles = useQuery(api.queries.getAllComponentStyles);

  useEffect(() => {
    if (activeTextarea && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeTextarea]);

  const handleUpdate = async (id: Id<"componentStyles">, classes: string) => {
    if (!readOnly) {
      await updateStyle({
        id,
        tailwindClasses: classes,
      });
    }
    setActiveTextarea(null);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>, id: Id<"componentStyles">) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdate(id, e.currentTarget.value);
    }
  };

  if (!styles?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No components created yet. Create one above to get started.
      </div>
    );
  }

  const filteredStyles = componentNames
    ? styles.filter(style => componentNames.includes(style.componentName))
    : styles;

    
  return (
    <div className="space-y-4 container mx-auto mt-10 pb-20">
      {filteredStyles.map((style) => (
      <div 
        key={style._id} 
        className="p-3 bg-secondary rounded-lg space-y-2"
        onClick={() => setActiveTextarea(style._id)}
      >
        <div className="font-medium">{style.componentName}</div>
        {activeTextarea === style._id && !readOnly ? (
            <Textarea
              ref={textareaRef}
              defaultValue={style.tailwindClasses}
              className="w-full mt-2"
              onKeyPress={(e) => handleKeyPress(e, style._id)}
              onBlur={(e) => handleUpdate(style._id, e.target.value)}
            />
          ) : (
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap cursor-pointer">
              {style.tailwindClasses}
            </pre>
          )}
        <div className="text-xs text-muted-foreground">
          Updated: {new Date(style.updated_at).toLocaleString()}
          {activeTextarea === style._id && " • Press Enter to save"}
        </div>
      </div>
    ))}
  </div>
  );
};