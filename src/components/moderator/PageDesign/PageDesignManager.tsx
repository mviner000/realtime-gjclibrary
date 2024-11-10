'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PageList } from "./PageDesignList"
import { PageDesignCreator } from "./PageDesignCreator"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export const PageDesignManager: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Submit a new design</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <PageDesignCreator 
                className="pt-6" 
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <PageList />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="w-full mb-4">Submit new page</Button>
        </DrawerTrigger>
        <DrawerContent>
          <PageDesignCreator 
            className="pt-6" 
            onSuccess={() => setIsDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
      <PageList />
    </div>
  )
}