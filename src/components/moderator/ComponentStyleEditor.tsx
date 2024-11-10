"use client"

import { useState, KeyboardEvent, useRef, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { Textarea } from "@/components/ui/textarea"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

interface ComponentStyleEditorProps {
  componentNames?: string[]
  showUpdateTime?: boolean
  showEnterToSave?: boolean
  readOnly?: boolean
}

export default function ComponentStyleEditor({
  componentNames,
  readOnly = false,
  showUpdateTime = true,
  showEnterToSave = true,
}: ComponentStyleEditorProps) {
  const [activeTextarea, setActiveTextarea] = useState<Id<"componentStyles"> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const updateStyle = useMutation(api.queries.updateComponentStyle)
  const styles = useQuery(api.queries.getAllComponentStyles)

  useEffect(() => {
    if (activeTextarea && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [activeTextarea])

  const handleUpdate = async (id: Id<"componentStyles">, classes: string) => {
    if (!readOnly) {
      await updateStyle({
        id,
        tailwindClasses: classes,
      })
    }
    setActiveTextarea(null)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>, id: Id<"componentStyles">) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleUpdate(id, e.currentTarget.value)
    }
  }

  // Loading state
  if (styles === undefined) {
    return (
      <div className="space-y-4 container mx-auto mt-10 pb-20">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="p-3 bg-secondary rounded-lg space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-48" />
              {showEnterToSave && <Skeleton className="h-4 w-36" />}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (!styles?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No components created yet. Create one above to get started.
      </div>
    )
  }

  const filteredStyles = componentNames
    ? styles.filter(style => componentNames.includes(style.componentName))
    : styles
    
  return (
    <div className="space-y-4 container mx-auto mt-10 pb-20">
      {filteredStyles.map((style, index) => (
        <motion.div 
          key={style._id} 
          className="p-3 bg-secondary rounded-lg space-y-2"
          onClick={() => setActiveTextarea(style._id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
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
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            {showUpdateTime && (
              <span>Updated: {new Date(style.updated_at).toLocaleString()}</span>
            )}
            {activeTextarea === style._id && showEnterToSave && (
              <span>Press Enter to save</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}