import { createSlice, createSelector } from "@reduxjs/toolkit";
// import { formatDate } from "../utils/functions";
import { RootState } from "./index";

export type PunchRecord = {
  punchIn: number;
  punchOut: number | null;
};

type MainState = {
  punches: PunchRecord[];
};

const initialState: MainState = {
  punches: [],
};

const selectPunches = (state: RootState) => state.main;

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    addDate: (state) => {
      state.punches.push({ punchIn: Date.now(), punchOut: null });
    },
    removeDate: (state, action) => {
      state.punches.filter((punch) => {
        return punch !== action.payload;
      });
    },
  },
});

export const createSelectPunches = () =>
  createSelector(selectPunches, (main) => main.punches);

export const { addDate } = mainSlice.actions;

export default mainSlice.reducer;
