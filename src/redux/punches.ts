import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'src/redux/store'

export interface PunchRecord {
  timeIn: number;
  timeOut: number;
  created: number;
  employer?: string;
  notes?: string;
}

type PunchType = Record<number, PunchRecord[]> & {selectedYear: number}

// Define the initial state using that type
const initialState: PunchType = {
  [new Date().getFullYear()]: [] as PunchRecord[],
  selectedYear: new Date().getFullYear(),
}

export const punchSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export const {  } = punchSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default punchSlice.reducer;
