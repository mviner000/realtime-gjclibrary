'use client'

import { useState, useCallback, useEffect } from "react"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "../../../../convex/_generated/api"
import { useDropzone } from 'react-dropzone'
import { Image, X } from "lucide-react"
import { useFetchUser } from "@/utils/useFetchUser"
import { useAuth } from "@/providers/authProviders"
import { LoadingState } from "@/constants/loading-state"

interface PageDesignCreatorProps {
  className?: string
  onSuccess?: () => void
}

export const PageDesignCreator: React.FC<PageDesignCreatorProps> = ({
  className,
  onSuccess
}) => {
  const [pageData, setPageData] = useState({
    pageNumber: "",
    pageUrl: "",
    notes: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const createPage = useMutation(api.queries.createPage)
  const generateUploadUrl = useMutation(api.queries.generateUploadUrl)
  const { data, error, isLoading } = useFetchUser()
  const auth = useAuth()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  })

  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect()
    }
  }, [auth, error])

  if (isLoading) return <LoadingState />

  const handleCreate = async () => {
    if (!pageData.pageNumber || !pageData.pageUrl || !data?.username) return

    try {
      setUploading(true)
      let storageId = undefined

      if (imageFile) {
        const uploadUrl = await generateUploadUrl()

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": imageFile.type,
          },
          body: imageFile,
        })

        if (!result.ok) throw new Error("Upload failed")
        const response = await result.json()
        storageId = response.storageId
      }

      await createPage({
        pageNumber: parseInt(pageData.pageNumber),
        pageUrl: pageData.pageUrl,
        proposedBy: data.username,
        proposedDate: new Date().toISOString(),
        approvedBy: "",
        notes: pageData.notes || "",
        imageId: storageId,
      })

      setPageData({
        pageNumber: "",
        pageUrl: "",
        notes: "",
      })
      setImageFile(null)
      setImagePreview(null)
      onSuccess?.()
    } catch (error) {
      console.error("Failed to create page:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Submit your design page</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${imagePreview ? 'bg-gray-50' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>Uploading...</div>
        ) : imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setImageFile(null)
                setImagePreview(null)
              }}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image className="h-12 w-12 text-gray-400 mb-2" />
            <p>Drag & drop an image here, or click to select</p>
          </div>
        )}
      </div>

      <Input
        type="number"
        placeholder="Page Number"
        value={pageData.pageNumber}
        onChange={(e) => setPageData((prev) => ({ ...prev, pageNumber: e.target.value }))}
      />
      <Input
        placeholder="Page URL"
        value={pageData.pageUrl}
        onChange={(e) => setPageData((prev) => ({ ...prev, pageUrl: e.target.value }))}
      />
      <Textarea
        placeholder="Notes (optional)"
        value={pageData.notes}
        onChange={(e) => setPageData((prev) => ({ ...prev, notes: e.target.value }))}
      />
      <Button 
        onClick={handleCreate} 
        className="w-full"
        disabled={uploading}
      >
        Submit New Page
      </Button>
    </div>
  )
}