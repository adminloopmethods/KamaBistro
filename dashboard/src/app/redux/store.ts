// app/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./slices/storeSlice";

export const store = configureStore({
  reducer: {
    storeData: storeReducer,
  },
});

// Inferred types for RootState and Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
