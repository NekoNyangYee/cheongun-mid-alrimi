import { create } from "zustand";

interface HeaderScrollState {
    isOpen: boolean;
    isHeaderScrolled: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setIsHeaderScrolled: (isHeaderScrolled: boolean) => void;
}

export const useHeaderScrollStore = create<HeaderScrollState>((set) => ({
    isHeaderScrolled: false,
    isOpen: false,
    setIsHeaderScrolled: (isHeaderScrolled) => set({ isHeaderScrolled }),
    setIsOpen: (isOpen) => set({ isOpen }),
}));