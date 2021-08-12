import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

export type PunchRecord = {
  punchIn: number | null;
  punchOut: number | null;
  date: number;
  notes?: string;
};

type PunchState = {
  [year: number]: PunchRecord[][];
  focusedYear: number;
};

const initialState: PunchState = {
  focusedYear: new Date().getFullYear(),
  [new Date().getFullYear()]: [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ] as PunchRecord[][],
};

const mainSlice = createSlice({
  initialState,
  name: "punches",
  reducers: {
    addCompletePunch: (state, action) => {
      const punch = action.payload;
      const date = new Date(punch.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!state[year]) {
        state[year] = [[], [], [], [], [], [], [], [], [], [], [], []];
      }

      const index = state[year][month].findIndex(
        (day) => new Date(day.date).getDate() > date.getDate(),
      );
      if (index > -1) {
        state[year][month].splice(index, 0, punch);
      } else {
        state[year][month].push(punch);
      }
    },
    addDate: (state) => {
      const now = new Date();

      if (!state?.[now.getFullYear()]) {
        state[now.getFullYear()] = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
        ];
      }

      state[now.getFullYear()][now.getMonth()].push({
        date: Date.now(),
        punchIn: null,
        punchOut: null,
      });
    },
    punchIn: (state, action) => {
      const { index, month } = action.payload;
      state[state.focusedYear][month][index].punchIn = Date.now();
    },
    punchOut: (state, action) => {
      const { index, month } = action.payload;
      state[state.focusedYear][month][index].punchOut = Date.now();
    },
    removeDate: (state, action) => {
      const { index, month } = action.payload;
      state[state.focusedYear][month].splice(index, 1);
    },
    setFocusedYear: (state, action) => {
      const { year } = action.payload;
      state.focusedYear = year;
    },
    setNotes: (state, action) => {
      const { index, month, notes } = action.payload;
      state[state.focusedYear][month][index].notes = notes;
    },
    setPunchIn: (state, action) => {
      const { index, month, date } = action.payload;
      state[state.focusedYear][month][index].punchIn = date;
    },
    setPunchOut: (state, action) => {
      const { index, month, date } = action.payload;
      state[state.focusedYear][month][index].punchOut = date;
    },
  },
});

const selectPunches = (state: RootState) => state.punches;
const selectFocusedYear = (state: RootState) => {
  if (!state.punches.focusedYear) {
    setFocusedYear({ year: new Date().getFullYear() });
  }
  return state.punches.focusedYear;
};

export const createSelectPunches = () =>
  createSelector(selectPunches, (punches) => punches);

export const createSelectFocusedYear = () =>
  createSelector(selectFocusedYear, (year) => year);

export const createSelectYearData = () =>
  createSelector(selectPunches, (data) => data[data.focusedYear] ?? []);

export const createSelectSinglePunch = ({
  index,
  month,
}: {
  index: number;
  month: number;
}) =>
  createSelector(
    selectPunches,
    (data) => data[data.focusedYear]?.[month]?.[index],
  );

export const {
  addCompletePunch,
  addDate,
  removeDate,
  punchIn,
  punchOut,
  setFocusedYear,
  setPunchIn,
  setPunchOut,
  setNotes,
} = mainSlice.actions;

export default mainSlice.reducer;
