import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./interface";
import {
  getRandomRating,
  getRandomDepartment,
  getRandomBio,
} from "@/utils/getrandom";

export const useStore = create(
  persist<{
    bears: User[];
    filteredBears: User[];
    bookmarkBears: User[];
    updateBears: (newBear: User) => void;
    updateBears_v0: (newBear: User[]) => void;
    insertRating: () => void;
    filtering: (newBear: User[]) => void;
    updateBookmark: (newBear: User, isbookmark: boolean) => void;
    bookmarking: () => void;
    updateBookmark_v0: (newBear: User) => void;
    deleteAll: () => void;
    homefiltering: (dept: string, rating: number) => void;
  }>(
    (set) => ({
      bears: [],
      filteredBears: [],
      bookmarkBears: [],
      updateBears: (newBear) =>
        set((state) => ({ bears: [...state.bears, newBear] })),
      updateBears_v0: (newBear) => set(() => ({ bears: [...newBear] })),
      insertRating: () =>
        set((state) => ({
          bears: state.bears.map((i) => ({
            ...i,
            rating: getRandomRating(),
            dept: getRandomDepartment(),
            bio: getRandomBio(),
            bookmark: false,
          })),
        })),
      filtering: (newBear) => set(() => ({ filteredBears: [...newBear] })),
      updateBookmark: (newBear, isBookmark) =>
        set((state) => {
          const bearToUpdate = { ...newBear, bookmark: isBookmark };
          let arr;

          if (isBookmark) {
            const exists = state.bookmarkBears.some(
              (b) => b.login.uuid === bearToUpdate.login.uuid
            );
            arr = exists
              ? state.bookmarkBears
              : [...state.bookmarkBears, bearToUpdate];
          } else {
            arr = state.bookmarkBears.filter(
              (b) => b.login.uuid !== bearToUpdate.login.uuid
            );
          }

          return { bookmarkBears: arr };
        }),
      bookmarking: () =>
        set((state) => ({
          bookmarkBears: [...state.bears.filter((i) => i.bookmark === true)],
        })),
      updateBookmark_v0: (newBear: User) =>
        set((state) => ({
          bookmarkBears: [...state.bookmarkBears, newBear],
        })),
      deleteAll: () =>
        set((state) => ({
          bears: state.bookmarkBears
            .filter((i) => i.bookmark === true)
            .map((i) => ({ ...i, bookmark: false })),
          bookmarkBears: [],
        })),
      homefiltering: (dept?: string, rating?: number) =>
        set((state) => {
          let arr: User[] = state.bears;
          if (dept) {
            arr = arr.filter((i) => i.dept === dept);
          }
          if (rating) {
            arr = arr.filter((i) => i.rating === rating);
          }
          return { filteredBears: arr };
        }),
    }),
    {
      name: "zustand-user-store", // key in localStorage
    }
  )
);
