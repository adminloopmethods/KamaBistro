// app/redux/slices/storeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserLocationData {
  locality: string;
  latitude: number;
  longitude: number;
  currentLocation: boolean;
  isParishSelection?: boolean;
}

export interface StoreState {
  userLocationData: UserLocationData | null;
}

const initialState: StoreState = {
  userLocationData: null,
};

const storeSlice = createSlice({
  name: "storeData",
  initialState,
  reducers: {
    updateUserLocationData: (
      state,
      action: PayloadAction<UserLocationData>
    ) => {
      state.userLocationData = action.payload;
    },
  },
});

export const { updateUserLocationData } = storeSlice.actions;
export default storeSlice.reducer;
