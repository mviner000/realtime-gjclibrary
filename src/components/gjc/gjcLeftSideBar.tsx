'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpen, ChevronDown, Home, UsersRound, UserPlus, Sparkle, LayoutDashboard, Menu, ArrowRight } from "lucide-react"
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
import Link from "next/link"
import { useSidebarStore } from "@/hooks/useSidebarStore"

export default function GJCLeftSideBar() {
    const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(true)
    const { isExpanded, toggleSidebar } = useSidebarStore()
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                useSidebarStore.setState({ isExpanded: false })
            } else {
                useSidebarStore.setState({ isExpanded: true })
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

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
        <>
        <motion.button
            className={cn(
                "fixed top-20 p-1 border border-black rounded-full bg-white z-[49]",
                isExpanded ? "left-60" : "left-12"
            )}
            onClick={toggleSidebar}
            animate={{
                left: isExpanded ? "15rem" : "3rem",
                rotate: isExpanded ? 180 : 0
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
            <ArrowRight className="text-black h-4 w-4" />
        </motion.button>
            <motion.aside 
                className={cn(
                    "pt-16 fixed top-16 left-0 h-[calc(100vh-4rem)] flex-shrink-0 overflow-y-auto border-r p-4",
                    leftSidebarStyle.tailwindClasses
                )}
                animate={{
                    width: isExpanded ? "16rem" : "4rem"
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <nav className="space-y-2 mt-6">
                    <TooltipProvider>
                        {[
                            { href: "/", icon: Home, label: "Home" },
                            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                            { href: "/students", icon: UsersRound, label: "Students" },
                            { href: "/faculties", icon: UserPlus, label: "Faculties" },
                            { href: "/admins", icon: Sparkle, label: "Admins" },
                        ].map(({ href, icon: Icon, label }) => (
                            <Tooltip key={href}>
                                <TooltipTrigger asChild>
                                    <div className={leftSidebarMainParentLinksStyle.tailwindClasses}>
                                        <Link href={href}>
                                            <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarMainLinksStyle.tailwindClasses)}>
                                                <Icon className={cn("mr-2 h-5 w-5", leftSidebarMainLinksIconStyle.tailwindClasses)}/>
                                                {isExpanded && <span>{label}</span>}
                                            </GJCButton>
                                        </Link>
                                    </div>
                                </TooltipTrigger>
                                {!isExpanded && (
                                    <TooltipContent side="right">
                                        <p>{label}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </nav>
                {isExpanded && (
                    <>
                        <div className="my-4 border-t" />
                        <Collapsible open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
                            <CollapsibleTrigger className={leftSidebarYourShortCutsAccordionStyle.tailwindClasses} asChild>
                                <Button variant="ghost" className="w-full justify-between">
                                    <div className="flex items-center">
                                        <BookOpen className={cn("mr-2 h-5 w-5", leftSidebarYourShortCutsAccordionIconStyle.tailwindClasses)}/>
                                        <span className={leftSidebarYourShortCutsAccordionTextStyle.tailwindClasses}>Your shortcuts</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 mt-1">
                                {[
                                    // { href: "/books", label: "Books", fallback: "BC" },
                                    // { href: "/student", label: "Student Cards", fallback: "SC" },
                                    { href: "/settings", label: "ADMIN SETTINGS", fallback: "AS" },
                                    { href: "/settings/designer", label: "Shortcut ni MACK", fallback: "MR" },
                                    { href: "/settings/frontend", label: "Shortcut ni MAVS", fallback: "RM" },
                                ].map(({ href, label, fallback }) => (
                                    <div key={href}>
                                        <Link href={href}>
                                            <GJCButton variant="ghost" className={cn("w-full justify-start", leftSidebarShortCutsButton.tailwindClasses)}>
                                                <Avatar className={cn("mr-2 h-6 w-6", leftSidebarShortCutsButtonIcon.tailwindClasses)}>
                                                    <AvatarFallback>{fallback}</AvatarFallback>
                                                </Avatar>
                                                <span className={leftSidebarShortCutsButtonText.tailwindClasses}>{label}</span>
                                            </GJCButton>
                                        </Link>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                        <div className={cn("fixed bottom-5 text-xs text-gray-500", leftSidebarFooterParent.tailwindClasses)} >
                            <p className={leftSidebarFooterText.tailwindClasses}>Privacy · Terms · Team Library © 2024</p>
                        </div>
                    </>
                )}
            </motion.aside>
        </>
    )
}