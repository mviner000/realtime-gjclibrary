'use client'

import { useState, KeyboardEvent } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "../../../../convex/_generated/api"

interface PageDesignCreatorProps {
  className?: string
}

export const PageDesignCreator: React.FC<PageDesignCreatorProps> = ({ className }) => {
  const [pageData, setPageData] = useState({
    pageNumber: "",
    pageUrl: "",
    proposedBy: "",
    notes: "",
  })

  const createPage = useMutation(api.queries.createPage)

  const handleCreate = async () => {
    if (!pageData.pageNumber || !pageData.pageUrl || !pageData.proposedBy) return

    try {
      await createPage({
        pageNumber: parseInt(pageData.pageNumber),
        pageUrl: pageData.pageUrl,
        proposedBy: pageData.proposedBy,
        proposedDate: new Date().toISOString(),
        approvedBy: "",
        notes: pageData.notes || "",
      })

      setPageData({
        pageNumber: "",
        pageUrl: "",
        proposedBy: "",
        notes: "",
      })
    } catch (error) {
      console.error("Failed to create page:", error)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCreate()
    }
  }

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Submit your design page</h2>
      <Input
        type="number"
        placeholder="Page Number"
        value={pageData.pageNumber}
        onChange={(e) => setPageData((prev) => ({ ...prev, pageNumber: e.target.value }))}
        onKeyPress={handleKeyPress}
      />
      <Input
        placeholder="Page URL"
        value={pageData.pageUrl}
        onChange={(e) => setPageData((prev) => ({ ...prev, pageUrl: e.target.value }))}
        onKeyPress={handleKeyPress}
      />
      <Input
        placeholder="Proposed By"
        value={pageData.proposedBy}
        onChange={(e) => setPageData((prev) => ({ ...prev, proposedBy: e.target.value }))}
        onKeyPress={handleKeyPress}
      />
      <Textarea
        placeholder="Notes (optional)"
        value={pageData.notes}
        onChange={(e) => setPageData((prev) => ({ ...prev, notes: e.target.value }))}
      />
      <Button onClick={handleCreate} className="w-full">
        Create Page
      </Button>
    </div>
  )
}