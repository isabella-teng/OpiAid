import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Signup from '../screens/Signup';
import Home from '../screens/Home';

export default createAppContainer(createSwitchNavigator({ Signup, Home }));
