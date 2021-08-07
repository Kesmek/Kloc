import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

export type PunchRecord = {
  punchIn: number | null;
  punchOut: number | null;
  date: number;
  notes?: string;
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
  initialState,
  name: "punches",
  reducers: {
    addDate: (state) => {
      state.data.push({ date: Date.now(), punchIn: null, punchOut: null });
    },
    punchIn: (state, action) => {
      const index = action.payload;
      state.data[index].punchIn = Date.now();
    },
    punchOut: (state, action) => {
      const index = action.payload;
      state.data[index].punchOut = Date.now();
    },
    removeDate: (state, action) => {
      state.data.splice(action.payload, 1);
    },
    setNotes: (state, action) => {
      const { index, notes } = action.payload;
      state.data[index].notes = notes;
    },
    setPunchIn: (state, action) => {
      const { index, date } = action.payload;
      state.data[index].punchIn = date;
    },
    setPunchOut: (state, action) => {
      const { index, date } = action.payload;
      state.data[index].punchOut = date;
    },
  },
});

export const createSelectPunches = () =>
  createSelector(selectPunches, (punches) => punches.data);

export const createSelectPunchData = (index: number) =>
  createSelector(selectPunchData, (data) => data[index]);

export const createSelectSectionedPunches = () =>
  createSelector(selectPunchData, (data) => {
    const sectionedPunches: {
      data: PunchRecord[];
      month: string;
    }[] = [
      {
        data: [],
        month: "January",
      },
      {
        data: [],
        month: "February",
      },
      {
        data: [],
        month: "March",
      },
      {
        data: [],
        month: "April",
      },
      {
        data: [],
        month: "May",
      },
      {
        data: [],
        month: "June",
      },
      {
        data: [],
        month: "July",
      },
      {
        data: [],
        month: "August",
      },
      {
        data: [],
        month: "September",
      },
      {
        data: [],
        month: "October",
      },
      {
        data: [],
        month: "November",
      },
      {
        data: [],
        month: "December",
      },
    ];

    data.forEach((punch) => {
      const date = new Date(punch.date);
      sectionedPunches[date.getMonth()].data.push(punch);
    });

    //Only return sections with data
    return sectionedPunches.filter((section) => section.data.length);
  });

export const {
  addDate,
  removeDate,
  punchIn,
  punchOut,
  setPunchIn,
  setPunchOut,
  setNotes,
} = mainSlice.actions;

export default mainSlice.reducer;
