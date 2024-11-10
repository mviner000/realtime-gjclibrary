'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface InfoData {
  pageNumber?: number
  pageUrl?: string
  proposedBy?: string
  proposedDate?: string
  updatedCounts?: number
  lastUpdateDate?: string
  approvedBy?: string
  notes?: string
}

export default function FloatingInfoButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [infoData, setInfoData] = useState<InfoData | null>(null)
  const buttonControls = useAnimation()
  const shimmerControls = useAnimation()

  // Start animations after mount
  useEffect(() => {
    const buttonAnimation = {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }

    const shimmerAnimation = {
      rotate: 360,
      scale: [1, 1.2, 1],
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }

    // Start animations
    buttonControls.start(buttonAnimation)
    shimmerControls.start(shimmerAnimation)

    // Cleanup function
    return () => {
      buttonControls.stop()
      shimmerControls.stop()
    }
  }, []) // Empty dependency array since we only want to run this once

  // Data loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInfoData({
        pageNumber: 1,
        pageUrl: '/',
        proposedBy: 'Mack Rafanan',
        proposedDate: '2023-05-15',
        updatedCounts: 3,
        lastUpdateDate: '2023-05-20',
        approvedBy: 'John Esternon',
        notes: 'This is a sample note for the page.',
      })
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="fixed top-24 right-10 z-[100]">
        <div className="relative">
          <motion.div
            className="relative z-[101]"
            animate={buttonControls}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 shadow-lg border-2 border-yellow-300 dark:border-yellow-400 cursor-pointer relative z-[102]"
              onClick={() => setIsOpen(true)}
            >
              <Info className="h-6 w-6 text-white dark:text-yellow-100" />
              <span className="sr-only">Information</span>
            </Button>
          </motion.div>

          {/* Background effects */}
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400 dark:bg-yellow-500 opacity-50 blur-sm z-[99]"
            animate={shimmerControls}
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-full z-[98]"
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] z-[200]">
          <DialogHeader>
            <DialogTitle>Page Information</DialogTitle>
            <DialogDescription>Details about the current page</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[220px]" />
                <Skeleton className="h-4 w-[190px]" />
                <Skeleton className="h-4 w-[170px]" />
                <Skeleton className="h-16 w-[300px]" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="pageNumber" className="text-right font-medium">Page #</label>
                  <input id="pageNumber" value={infoData?.pageNumber || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="pageUrl" className="text-right font-medium">Page URL</label>
                  <input id="pageUrl" value={infoData?.pageUrl || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="proposedBy" className="text-right font-medium">Proposed by</label>
                  <input id="proposedBy" value={infoData?.proposedBy || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="proposedDate" className="text-right font-medium">Proposed Date</label>
                  <input id="proposedDate" value={infoData?.proposedDate || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="updatedCounts" className="text-right font-medium">Updated Counts</label>
                  <input id="updatedCounts" value={infoData?.updatedCounts || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="lastUpdateDate" className="text-right font-medium">Last Update Date</label>
                  <input id="lastUpdateDate" value={infoData?.lastUpdateDate || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="approvedBy" className="text-right font-medium">Approved by</label>
                  <input id="approvedBy" value={infoData?.approvedBy || ''} readOnly className="col-span-2 bg-muted p-2 rounded" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="notes" className="text-right font-medium">Notes</label>
                  <textarea id="notes" value={infoData?.notes || ''} readOnly className="col-span-2 bg-muted p-2 rounded h-20 resize-none" />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}