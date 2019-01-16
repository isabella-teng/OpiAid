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

// base navigation options for not-main-tabs (convo, settings, profile)
const stackNavigatorConfig = {
  headerStyle: {
    // backgroundColor: '#363E54',
    backgroundColor: '#3a4257',
    ...(Platform.OS === 'ios' ? {} : {
      marginTop: -20,
      height: 60,
    }),
    borderBottomWidth: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: '#fff',
  },
};

export { navigate, setTopLevelNavigator, getNavigationState, dictToScreens, stackNavigatorConfig };
