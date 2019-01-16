import equal from 'fast-deep-equal';
import { actionCreator, createReducer, handleShallow } from './util';
import { get } from '../util/util';

const startSession = actionCreator('START_SESSION', 'session');
const setMe = actionCreator('SET_ME', 'me');

const getMe = () => async (dispatch, getState) => {
  const res = await get('/me');

  if (res.status === 'success' && !equal(getState().user.me, res.data)) {
    console.log(`Detected difference, dispatching setMe`);
    dispatch(setMe(res.data));
  }

  return res;
};

const initialState = {
  session: null,
  me: null,
};

export default createReducer(initialState, {
  START_SESSION: handleShallow('session'),
  SET_ME: handleShallow('me'),
});

export {
  startSession,
  getMe,
};
