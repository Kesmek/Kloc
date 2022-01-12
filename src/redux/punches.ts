import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'src/redux/store';

export interface PunchType {
  timeIn: number;
  timeOut?: number;
  notes?: string;
}

interface PunchYear {
  [month: number]: PunchType[];
}

interface PunchEmployer {
  [year: number]: PunchYear;
  firstDay: number;
  lastDay: number;
}

type PunchRecord = Record<string, PunchEmployer>;

// Define the initial state using that type
const initialState: PunchRecord = {};

export const punchSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addTime: (
      state,
      action: PayloadAction<{ employer: string } & PunchType>,
    ) => {
      const { employer, timeIn, timeOut, notes } = action.payload;
      const date = new Date(timeIn);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!state[employer][year]) {
        state[employer][year] = {
          [month]: [{ timeIn, timeOut, notes }],
        };
        if (state[employer].firstDay > timeIn)
          state[employer].firstDay = timeIn;
        if (state[employer].lastDay < timeIn) state[employer].lastDay = timeIn;
      } else if (!state[employer][year][month]) {
        state[employer][year][month] = [{ timeIn, timeOut, notes }];
      } else {
        state[employer][year][month].push({ timeIn, timeOut, notes });
        if (state[employer].firstDay > timeIn)
          state[employer].firstDay = timeIn;
        if (state[employer].lastDay < timeIn) state[employer].lastDay = timeIn;
      }
    },
  },
});

export const {} = punchSlice.actions;

const selectPunches = (state: RootState) => state.punches;

export const createSelectPunches = () =>
  createSelector(selectPunches, state => state);
export const createSelectYearPunches = ({
  employer,
  year,
}: {
  employer: string;
  year: number;
}) => createSelector(selectPunches, state => state[employer][year]);

export default punchSlice.reducer;
