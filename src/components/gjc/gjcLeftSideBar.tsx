'use client'

import * as React from "react"
import { BookOpen, ChevronDown, Home, UsersRound, UserPlus, Sparkle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { cn } from "@/lib/utils"
import { GJCButton } from "../ui/gjc_ui/gjcButton"

export default function GJCLeftSideBar() {
    const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(true)

    const leftSidebarStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar" 
    });
   
    const leftSidebarMainLinksIconStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.main.links.icon" 
    });

    const leftSidebarMainParentLinksStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.main.parent.links" 
    });

    const leftSidebarMainLinksStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.main.links" 
    });

    const leftSidebarYourShortCutsAccordionStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.your.shortcuts.accordion" 
    });

    const leftSidebarYourShortCutsAccordionTextStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.your.shortcuts.accordion.text" 
    });

    const leftSidebarYourShortCutsAccordionIconStyle = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.your.shortcuts.accordion.icon" 
    });

    const leftSidebarShortCutsButton = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.shortcuts.button" 
    });

    const leftSidebarShortCutsButtonText = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.shortcuts.button.text" 
    });

    const leftSidebarShortCutsButtonIcon = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.shortcuts.button.icon" 
    });

    const leftSidebarFooterParent = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.footer.parent" 
    });

    const leftSidebarFooterText = useQuery(api.queries.getComponentStyle, { 
        componentName: "leftSideBar.footer.text" 
    });  

    if (!leftSidebarStyle || !leftSidebarMainLinksStyle || !leftSidebarMainParentLinksStyle || !leftSidebarMainLinksIconStyle || !leftSidebarYourShortCutsAccordionStyle || !leftSidebarYourShortCutsAccordionTextStyle || !leftSidebarYourShortCutsAccordionIconStyle || !leftSidebarShortCutsButton  || !leftSidebarShortCutsButtonText || !leftSidebarShortCutsButtonIcon || !leftSidebarFooterParent || !leftSidebarFooterText) {
        return <div className="text-muted-foreground">Loading leftSideBar styles...</div>;
      }

    return (
        <aside className={cn("pt-16 fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto border-r p-4", leftSidebarStyle.tailwindClasses)}>
        <nav className="space-y-2">
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <div className={leftSidebarMainParentLinksStyle.tailwindClasses}>
                <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarMainLinksStyle.tailwindClasses)}>
                    <Home className={cn("mr-2 h-5 w-5", leftSidebarMainLinksIconStyle.tailwindClasses)}/>
                    <span>Home</span>
                </GJCButton>
                </div>
                </TooltipTrigger>
                <TooltipContent>
                <p>Home</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <div className={leftSidebarMainParentLinksStyle.tailwindClasses}>
                <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarMainLinksStyle.tailwindClasses)}>
                    <UsersRound className={cn("mr-2 h-5 w-5", leftSidebarMainLinksIconStyle.tailwindClasses)}/>
                    <span>Students</span>
                </GJCButton>
                </div>
                </TooltipTrigger>
                <TooltipContent>
                <p>Students</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <div className={leftSidebarMainParentLinksStyle.tailwindClasses}>
                <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarMainLinksStyle.tailwindClasses)}>
                    <UserPlus className={cn("mr-2 h-5 w-5", leftSidebarMainLinksIconStyle.tailwindClasses)}/>
                    <span>Faculties</span>
                </GJCButton>
                </div>
                </TooltipTrigger>
                <TooltipContent>
                <p>Faculties</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <div className={leftSidebarMainParentLinksStyle.tailwindClasses}>
                <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarMainLinksStyle.tailwindClasses)}>
                    <Sparkle className={cn("mr-2 h-5 w-5", leftSidebarMainLinksIconStyle.tailwindClasses)}/>
                    <span>Admins</span>
                </GJCButton>
                </div>
                </TooltipTrigger>
                <TooltipContent>
                <p>Admins</p>
                </TooltipContent>
            </Tooltip>
            </TooltipProvider>
        </nav>
        <div className="my-4 border-t" />
        <Collapsible open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
            <CollapsibleTrigger className={leftSidebarYourShortCutsAccordionStyle.tailwindClasses} asChild>
            <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center">
                <BookOpen className={cn("mr-2 h-5 w-5" , leftSidebarYourShortCutsAccordionIconStyle.tailwindClasses)}/>
                <span className={leftSidebarYourShortCutsAccordionTextStyle.tailwindClasses}>Your shortcuts</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
            <GJCButton variant="ghost" className={cn("w-full justify-start" , leftSidebarShortCutsButton.tailwindClasses)}>
                <Avatar className={cn("mr-2 h-6 w-6" , leftSidebarShortCutsButtonIcon.tailwindClasses)}>
                    <AvatarFallback>BC</AvatarFallback>
                </Avatar>
                <span className={leftSidebarShortCutsButtonText.tailwindClasses}>Books</span>
            </GJCButton>
            <GJCButton variant="ghost" className={cn("w-full justify-start" , leftSidebarShortCutsButton.tailwindClasses)}>
                <Avatar className={cn("mr-2 h-6 w-6" , leftSidebarShortCutsButtonIcon.tailwindClasses)}>
                    <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <span className={leftSidebarShortCutsButtonText.tailwindClasses}>Student Cards</span>
            </GJCButton>
            </CollapsibleContent>
        </Collapsible>
        <div className={cn("fixed bottom-5 text-xs text-gray-500" , leftSidebarFooterParent.tailwindClasses)} >

            <p className={leftSidebarFooterText.tailwindClasses}>Privacy · Terms · Team Library © 2024</p>
        </div>
        </aside>
    )
}