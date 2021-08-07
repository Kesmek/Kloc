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

    MOCK.forEach((punch) => {
      const date = new Date(punch.date);
      sectionedPunches[date.getMonth()].data.push(punch);
    });

    return sectionedPunches;
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

const MOCK = [
  { date: 1626803931893, punchIn: 1626803966463, punchOut: 1626830145993 },
  { date: 1626969936666, punchIn: 1626969975663, punchOut: 1627005913262 },
  { date: 1627056469908, punchIn: 1627056482699, punchOut: 1627091025984 },
  { date: 1627229033300, punchIn: 1627229085511, punchOut: 1627265331405 },
  { date: 1627402002607, punchIn: 1627402003154, punchOut: 1627440607725 },
  { date: 1627488350556, punchIn: 1627488351111, punchOut: 1627524919757 },
  { date: 1627660903134, punchIn: 1627660903711, punchOut: 1627694131918 },
  { date: 1627747565628, punchIn: 1627747566115, punchOut: 1627778862984 },
  { date: 1627833692605, punchIn: 1627833756414, punchOut: 1627871155354 },
  { date: 1627999821580, punchIn: 1627999933989, punchOut: 1628042537739 },
  { date: 1628179322702, punchIn: 1628179388919, punchOut: 1628212225050 },
  { date: 1628265729888, punchIn: 1628265820758, punchOut: 1628302040805 },
];
