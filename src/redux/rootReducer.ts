import { combineReducers } from '@reduxjs/toolkit';
import PunchesReducer from './punches';

export default combineReducers({
  punches: PunchesReducer,
});
