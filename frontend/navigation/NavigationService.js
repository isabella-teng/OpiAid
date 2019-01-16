import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

const setTopLevelNavigator = navigatorRef => new Promise(resolve => setTimeout(() => {
  _navigator = navigatorRef;
  resolve(_navigator);
}, 100));

const navigate = (routeName, params, { action, key, forcePush } = {}) => {
  const options = { routeName, params, action, key };
  const navAction = forcePush
    ? StackActions.push(options)
    : NavigationActions.navigate(options);
  _navigator && _navigator.dispatch(navAction);
};

const getNavigationState = ({ level = 0, state = _navigator } = {}) => {
  let fullState = (((state || {}).state || {}).nav) || {};
  for (let i = level; i > 0; i -= 1) {
    fullState = (fullState.routes && fullState.routes[fullState.index]) || fullState;
  }
  return fullState;
};

export { navigate, setTopLevelNavigator, getNavigationState };
