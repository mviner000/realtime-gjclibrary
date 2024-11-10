'use client'

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Edit2, Save, XCircle, Check } from "lucide-react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { PageType } from "@/types"

interface PageListProps {
  className?: string
}

export const PageList: React.FC<PageListProps> = ({ className }) => {
  const [editingPage, setEditingPage] = useState<Id<"pages"> | null>(null)
  const [editData, setEditData] = useState({
    pageUrl: "",
    notes: "",
  })

  const pages = useQuery(api.queries.getAllPages) as PageType[] | undefined
  const updatePage = useMutation(api.queries.updatePage)
  const deletePage = useMutation(api.queries.deletePage)
  const checkPage = useMutation(api.queries.checkPage)

  const handleEdit = (page: PageType) => {
    setEditingPage(page._id)
    setEditData({
      pageUrl: page.pageUrl,
      notes: page.notes,
    })
  }

  const handleUpdate = async (id: Id<"pages">) => {
    try {
      await updatePage({
        id,
        pageUrl: editData.pageUrl,
        notes: editData.notes,
      })
      setEditingPage(null)
    } catch (error) {
      console.error("Failed to update page:", error)
    }
  }

  const handleDelete = async (id: Id<"pages">) => {
    try {
      await deletePage({ id })
    } catch (error) {
      console.error("Failed to delete page:", error)
    }
  }

  const handleCheck = async (id: Id<"pages">, checked: boolean) => {
    try {
      await checkPage({
        id,
        isChecked: checked,
      })
    } catch (error) {
      console.error("Failed to check page:", error)
    }
  }

  if (!pages) return <div className="text-center p-4">Loading...</div>

  return (
    <div className={`space-y-4 mt-3 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Pages List</h2>
      {pages.length === 0 ? (
        <p className="text-center text-gray-500">No pages created yet</p>
      ) : (
        pages.map((page) => (
          <Card key={page._id} className="relative">
            <CardContent className="p-4">
              {editingPage === page._id ? (
                <div className="space-y-4">
                  <Input
                    value={editData.pageUrl}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, pageUrl: e.target.value }))
                    }
                    placeholder="Page URL"
                  />
                  <Textarea
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Notes"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(page._id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingPage(null)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${page._id}`}
                      checked={page.isChecked || false}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleCheck(page._id, checked)
                        }
                      }}
                    />
                    <div>
                      <h3 className="font-medium">Page {page.pageNumber}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        URL: {page.pageUrl}
                      </p>
                      <p className="text-sm text-gray-500">
                        Proposed by: {page.proposedBy}
                      </p>
                      {page.notes && (
                        <p className="text-sm text-gray-500">Notes: {page.notes}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Updated: {new Date(page.lastUpdateDate).toLocaleDateString()}{" "}
                        ({page.updatedCounts} updates)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={page.isChecked ? "default" : "secondary"}>
                      {page.isChecked ? "Checked" : "Unchecked"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100"
                        onClick={() => handleDelete(page._id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}