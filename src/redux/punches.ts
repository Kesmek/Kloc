import { createSlice, createSelector } from "@reduxjs/toolkit";
import { monthNames } from "../utils/constants";
import { RootState } from "./index";

export type PunchRecord = {
  punchIn: number | null;
  punchOut: number | null;
  date: number;
  notes?: string;
};

type PunchState = {
  [year: number]: PunchRecord[][];
};

const initialState: PunchState = {};

const selectPunches = (state: RootState) => state.punches;

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
      const { index, month, year } = action.payload;
      state[year][month][index].punchIn = Date.now();
    },
    punchOut: (state, action) => {
      const { index, month, year } = action.payload;
      state[year][month][index].punchOut = Date.now();
    },
    removeDate: (state, action) => {
      const { index, month, year } = action.payload;
      state[year][month].splice(index, 1);
    },
    setNotes: (state, action) => {
      const { index, month, year, notes } = action.payload;
      state[year][month][index].notes = notes;
    },
    setPunchIn: (state, action) => {
      const { index, month, year, date } = action.payload;
      state[year][month][index].punchIn = date;
    },
    setPunchOut: (state, action) => {
      const { index, month, year, date } = action.payload;
      state[year][month][index].punchOut = date;
    },
  },
});

export const createSelectPunches = () =>
  createSelector(selectPunches, (punches) => punches);

export const createSelectYearData = (year: number) =>
  createSelector(selectPunches, (data) => data?.[year] ?? []);

export const createSelectSectionedPunches = (year: number) =>
  createSelector(selectPunches, (data) => {
    const yearData = data?.[year];

    //Only return sections with data
    const sectionedPunches =
      yearData
        ?.map((value, index) => {
          const month = monthNames[index];
          return {
            data: value,
            month: month,
          };
        })
        .filter((section) => section.data.length) ?? [];

    return sectionedPunches;
  });

export const createSelectSinglePunch = ({
  index,
  month,
  year,
}: {
  index: number;
  month: number;
  year: number;
}) => createSelector(selectPunches, (data) => data?.[year]?.[month]?.[index]);

export const {
  addCompletePunch,
  addDate,
  removeDate,
  punchIn,
  punchOut,
  setPunchIn,
  setPunchOut,
  setNotes,
} = mainSlice.actions;

export default mainSlice.reducer;
