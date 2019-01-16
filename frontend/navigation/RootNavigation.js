import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import HomeNavigator from './HomeNavigation';
import Signup from '../screens/Signup';

export default createAppContainer(createSwitchNavigator({ Signup, Home: HomeNavigator }));
