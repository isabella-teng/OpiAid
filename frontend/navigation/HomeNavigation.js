import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import ImportContacts from '../screens/ImportContacts';
import ChatScreen from '../screens/ChatScreen';
import Home from '../screens/Home';
import { dictToScreens } from './NavigationService';

const stackNavigatorConfig = {
  headerMode: 'screen',
  headerTintColor: '#fff',
  headerTitleStyle: {
    backgroundColor: '#5892F9',
  },
};

// for each (key: value) map (SignupLanding: Landing) => (SignupLanding: { screen: Landing })
const screens = dictToScreens({ Home, ChatScreen, ImportContacts });

const HomeNavigator = createStackNavigator(screens, { ...stackNavigatorConfig, initialRouteName: 'Home' });

export default HomeNavigator;
