// combines initial state and dict reducers into one reducer by slice
// example: combineReducers({ map: [] }, { map: mapReducer, user: userReducer }) ==
//   (state = { map: [] }, action) => ({
//     map: mapReducer(state.map, action),
//     user: userReducer(state.user, action),
//   })
const combineReducers = (initial, reducers) => (state = initial, action) => (
  Object.entries(reducers).reduce((acc, [key, reducer]) => (
    { ...acc, [key]: reducer(state[key], action) }
  ), state)
);

// make a dict given a set of keys and values
// example: makeDict(['x', 'y'], [1, 2]) == { x: 1, y: 2 };
const makeDict = (keys, values) => (
  [].concat(keys).reduce((acc, key, idx) => {
    acc[key] = values && values[idx];
    return acc;
  }, {})
);

// map array of objects to dict by key
// example: arrayToDict([{id: 1}, {id: 2}], 'id') == {1: {id: 1}, 2: {id: 2}}
const arrayToDict = (arr, key = 'id') => (
  arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {})
);

// Creates a synchronous (simple) action creator
// example: syncActionCreator('SET_USER', 'user_id', 'name') ==
//   (user_id, name) => ({ type: 'SET_USER', payload: { user_id, name } });
const actionCreator = (type, ...keys) =>
  (...values) => ({ type, payload: makeDict(keys, values) });

// Creates reducer given handlers for different redux actions
// example: createReducer({}, { SET_USER: handleUser, SET_MAP: handleMap }) ==
//   (state={}, action) =>
//    ({ SET_USER: handleUser, SET_MAP: handleMap })[action.type]
//      ? ({ SET_USER: handleUser, SET_MAP: handleMap })[action.type](state, action)
//      : state
const createReducer = (initial, handlers) => (state = initial, action) =>
  (handlers[action.type] ? handlers[action.type](state, action) : state);

// Basic handler for actions, moves key from payload to current slice of state
// example: handleShallow('user') == (state, action) => ({ ...state, user: action.payload.user })
const handleShallow = key => (state, action) =>
  ({ ...state, [key]: action.payload[key] });

// Maps on object of functions to a mapDispatchToProps function to be used with redux's connect
// example:
// dispatchToProps({
//   getMyChannels: getChannels,
//   getMessages,
//   navUserList: () => setSideContent('userList') // hack to preset an arg to action creator
// }) ==
//   dispatch => ({
//     getMyChannels: () => dispatch(getChannels()),
//     getMessages: (id) => dispatch(getMessages(id)),
//     navUserList: () => dispatch((() => setSideContent('userList'))()),
//     // with previous line equivalent to
//     // navUserList: () => dispatch(setSideContent('userList')),
//   })
const dispatchToProps = functions => dispatch =>
  Object.entries(functions).reduce((acc, [key, f]) => {
    if (f) acc[key] = (...x) => dispatch(f(...x));
    return acc;
  }, {});

const clearState = actionCreator('CLEAR', 'keepSession', 'resetNavigation');

export {
  arrayToDict,
  actionCreator,
  createReducer,
  handleShallow,
  combineReducers,
  dispatchToProps,
  clearState,
};
