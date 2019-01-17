import { NavigationActions, StackActions } from 'react-navigation';
import { Platform } from 'react-native';

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

const dictToScreens = (screens, prefix = '', options = {}) => (
  Object.entries(screens).reduce((acc, [key, value]) => {
    acc[`${prefix}${key}`] = { screen: value };
    return acc;
  }, {})
);

export { navigate, setTopLevelNavigator, getNavigationState, dictToScreens };
