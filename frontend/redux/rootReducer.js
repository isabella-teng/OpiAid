import { combineReducers } from './util';
import userReducer from './user';

const initialState = {
  user: {},
  navigationKey: '1-NavigationState',
};

const rootReducer = combineReducers(initialState, {
  user: userReducer,
});

export const newNavKey = oldKey => `${parseInt(oldKey.split('-')[0], 10) + 1}-NavigationState`;

export default (state = initialState, action) => {
  const { type, payload } = action;
  if (type === 'CLEAR') {
    const session = payload.keepSession ? state.user.session : null;
    console.log('CLEARING STATE', payload.keepSession, 'new session', session);

    let navKey = state.navigationKey;
    if (payload.resetNavigation) navKey = newNavKey(state.navigationKey);
    return {
      ...initialState,
      user: { ...initialState.user, session },
      navigationKey: navKey
    };
  }
  return rootReducer(state, action);
};
