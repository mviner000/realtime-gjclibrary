import { create } from 'zustand'

type SidebarState = {
  isExpanded: boolean
  toggleSidebar: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
}))

// Custom hook to get the dynamic padding class based on sidebar state
export const useSidebarPadding = () => {
  const isExpanded = useSidebarStore((state) => state.isExpanded)
  return isExpanded ? 'pl-72' : 'pl-24'
}