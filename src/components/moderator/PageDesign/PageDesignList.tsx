'use client'

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Edit2, Save, XCircle, ImageIcon, Maximize2 } from "lucide-react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { PageType } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useStorageUrl} from "@/utils/useStorageUrl"
import { useFetchUser } from "@/utils/useFetchUser"
import { useAuth } from "@/providers/authProviders"
import { LoadingState } from "@/constants/loading-state"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface PageListProps {
  className?: string
}

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (username: string) => void
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [usernameInput, setUsernameInput] = useState("")

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm(usernameInput);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Username</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Enter your username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(usernameInput)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="aspect-video relative">
          <Skeleton className="w-full h-full" />
        </div>
        <CardHeader>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-8 w-24" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

const FullscreenModal = ({ 
  imageUrl, 
  onClose 
}: { 
  imageUrl: string; 
  onClose: () => void 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      <img
        src={imageUrl}
        alt="Fullscreen design"
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  )
}

const PageCard = ({ 
  page,
  onImageClick,
  canCheck,
  onCheckToggle
}: { 
  page: PageType;
  onImageClick: (imageUrl: string) => void;
  canCheck: boolean;
  onCheckToggle: (checked: boolean) => void;
}) => {
  const imageUrl = useStorageUrl(page.imageId);
  
  return (
    <div 
      className="aspect-video relative bg-gray-100 flex items-center justify-center group cursor-pointer"
      onClick={() => imageUrl && onImageClick(imageUrl)}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`Page ${page.pageNumber} design`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-all h-8 w-8" />
          </div>
        </>
      ) : (
        <ImageIcon className="w-12 h-12 text-gray-400" />
      )}
      <Badge 
        className="absolute top-2 right-2 z-10"
        variant={page.isChecked ? "default" : "secondary"}
      >
        {page.isChecked ? `Checked by ${page.approvedBy}` : "Unchecked"}
      </Badge>
      {canCheck && (
        <div className="absolute bottom-2 right-2 z-10">
          <Checkbox
            checked={page.isChecked}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                onCheckToggle(checked)
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export const PageList: React.FC<PageListProps> = ({ className }) => {
  const [editingPage, setEditingPage] = useState<Id<"pages"> | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [pendingCheck, setPendingCheck] = useState<{
    pageId: Id<"pages">;
    checked: boolean;
  } | null>(null)
  const [editData, setEditData] = useState({
    pageUrl: "",
    notes: "",
  })

  const pages = useQuery(api.queries.getAllPages) as PageType[] | undefined
  const updatePage = useMutation(api.queries.updatePage)
  const deletePage = useMutation(api.queries.deletePage)
  const checkPage = useMutation(api.queries.checkPage)

  const { data: userData, error, isLoading } = useFetchUser();
  const auth = useAuth();

  const canCheck = userData?.username === "esternon52320018" || userData?.username === "admin21"

  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

  if (isLoading) return <LoadingState />;

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

  const handleCheckAttempt = (pageId: Id<"pages">, checked: boolean) => {
    setPendingCheck({ pageId, checked })
    setVerificationModalOpen(true)
  }

  const handleVerificationConfirm = async (usernameInput: string) => {
    if (!pendingCheck) return;

    if (usernameInput === userData?.username && canCheck) {
      try {
        await checkPage({
          id: pendingCheck.pageId,
          isChecked: pendingCheck.checked,
          approvedBy: userData.username
        })
        toast({
          title: "Success",
          description: "Page status updated successfully",
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update page status",
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "Error",
        description: "Username verification failed",
        variant: "destructive"
      })
    }
    setVerificationModalOpen(false)
    setPendingCheck(null)
  }

  if (!pages) return <LoadingSkeleton />

  return (
    <div className={`${className}`}>
      {fullscreenImage && (
        <FullscreenModal
          imageUrl={fullscreenImage}
          onClose={() => setFullscreenImage(null)}
        />
      )}
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => {
          setVerificationModalOpen(false)
          setPendingCheck(null)
        }}
        onConfirm={handleVerificationConfirm}
      />
      <h2 className="text-2xl font-bold mb-6">All Pages Designs</h2>
      {pages.length === 0 ? (
        <p className="text-center text-gray-500">No pages created yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {pages.map((page) => (
            <Card key={page._id} className="overflow-hidden">
              {editingPage === page._id ? (
                <CardContent className="p-4 space-y-4">
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
                </CardContent>
              ) : (
                <>
                  <PageCard 
                    page={page} 
                    onImageClick={(imageUrl) => setFullscreenImage(imageUrl)}
                    canCheck={canCheck}
                    onCheckToggle={(checked) => handleCheckAttempt(page._id, checked)}
                  />
                  <CardHeader>
                    <h3 className="font-medium">Page {page.pageNumber}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      URL: {page.pageUrl}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Proposed by: {page.proposedBy}
                    </p>
                    {page.notes && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {page.notes}
                      </p>
                    )}
                    {/* <p className="text-xs text-gray-400 mt-2">
                      Updated: {new Date(page.lastUpdateDate).toLocaleDateString()}{" "}
                      ({page.updatedCounts} updates)
                    </p> */}
                    <p className="text-xs text-gray-400 mt-2">
                      Updated: {new Date(page.lastUpdateDate).toLocaleDateString()}{" "}
                    </p>
                  </CardContent>
                  <CardFooter className="justify-end space-x-2">
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
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}