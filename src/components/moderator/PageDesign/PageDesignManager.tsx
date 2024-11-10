'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { PageList } from "./PageDesignList"
import { PageDesignCreator } from "./PageDesignCreator"

export const PageDesignManager: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <div className="md:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="w-full mb-4">Create New Page</Button>
          </DrawerTrigger>
          <DrawerContent>
            <PageDesignCreator className="pt-6" />
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <PageDesignCreator />
        </div>
        <div className="col-span-2">
          <PageList />
        </div>
      </div>
      <div className="md:hidden">
        <PageList />
      </div>
    </div>
  )
}