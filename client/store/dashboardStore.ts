import { BoardView, User } from "@/types/types";
import { create } from "zustand";

export type State = {
  boardView: BoardView;
  user: User | null;
  users: User[]; 
};

export type Actions = {
  setBoardView: (boardView: BoardView) => void;
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
};

export const useDashboardStore = create<State & Actions>((set) => ({
  boardView: "list",
  user: null,
  users: [], 
  setUser: (user: User | null) => set({ user }),
  setBoardView: (boardView: BoardView) => set({ boardView }),
  setUsers: (users: User[]) => set({ users }), 
}));
