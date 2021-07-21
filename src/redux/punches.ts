import { createSlice, createSelector } from "@reduxjs/toolkit";
// import { formatDate } from "../utils/functions";
import { RootState } from "./index";

export type PunchRecord = {
  punchIn: number | null;
  punchOut: number | null;
  date: number;
};

type PunchState = {
  data: PunchRecord[];
};

const initialState: PunchState = {
  data: [],
};

const selectPunches = (state: RootState) => state.punches;
const selectPunchData = (state: RootState) => state.punches.data;

const mainSlice = createSlice({
  name: "punches",
  initialState,
  reducers: {
    addDate: (state) => {
      state.data.push({ punchIn: null, punchOut: null, date: Date.now() });
    },
    removeDate: (state, action) => {
      state.data.splice(action.payload, 1);
    },
    punchIn: (state, action) => {
      const index = action.payload;
      state.data[index].punchIn = Date.now();
    },
    punchOut: (state, action) => {
      const index = action.payload;
      state.data[index].punchOut = Date.now();
    },
    setPunchIn: (state, action) => {
      const { index, date } = action.payload;
      state.data[index].punchIn = parseInt(date);
    },
    setPunchOut: (state, action) => {
      const { index, date } = action.payload;
      state.data[index].punchOut = parseInt(date);
    },
  },
});

export const createSelectPunches = () =>
  createSelector(selectPunches, (punches) => punches.data);

export const createSelectPunchData = (index: number) =>
  createSelector(selectPunchData, (data) => data[index]);

export const {
  addDate,
  removeDate,
  punchIn,
  punchOut,
  setPunchIn,
  setPunchOut,
} = mainSlice.actions;

export default mainSlice.reducer;
