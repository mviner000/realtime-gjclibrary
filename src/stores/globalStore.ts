// import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface GlobalState {
  // filteredDate: DateRange | undefined;
  // setFilteredDate: (date: DateRange | undefined) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (isOpen: boolean) => void;
  isLocked: boolean;
  setIsLocked: (val: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()((set, get) => ({
  // filteredDate: {
  //   from: new Date(),
  //   to: new Date(),
  // },
  // setFilteredDate: (date) =>
  //   set({
  //     filteredDate: date,
  //   }),
  isPinModalOpen: false,
  setIsPinModalOpen: (isOpen) => set({ isPinModalOpen: isOpen }),

  isLocked: true,
  setIsLocked: (val) => set({ isLocked: val }),
}));
