import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Fragment,
} from 'react-native';
import { Util } from 'expo';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import { useScreens } from 'react-native-screens';

import rootReducer, { newNavKey } from './redux/rootReducer';
import { clearState } from './redux/util';
import Touchable from './components/Touchable';
import Root from './Root';

useScreens();
const migrations = {
  1: state => ({ ...state }),
  2: state => ({ ...state, navigationKey: newNavKey(state.navigationKey) }),
};
const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
};
const reducer = persistReducer(persistConfig, rootReducer);
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const persistor = persistStore(store);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  logoutAndReload = () => {
    store.dispatch(clearState(false, true));
    Util.reload();
  };

  componentDidCatch(error, info) {
    console.log('App Error Caught:', error, info);
    this.setState({ hasError: true, errorInfo: info });
    store.dispatch(clearState(true, true)); // Reset redux cache (but keep session) on fatal crash
  }

  onChange = text => this.setState({ text });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer} onPress={Util.reload} feedback>
          <View style={{ height: 20 }} />
          <Text style={styles.errorText}>Encountered an error running the app :(</Text>
          {!!this.state.errorInfo && (
            <Fragment>
              <Text style={styles.errorInfoText}>More information -- feel free to text this over to us, +1(847)566-2463!</Text>
              <Text style={styles.errorInfoText}>{this.state.errorInfo}</Text>
            </Fragment>
          )}
          <View style={{ height: 20 }} />
          <Touchable onPress={Util.reload}>
            <Text style={[styles.errorText, { textDecorationLine: 'underline' }]}>Restart the app</Text>
          </Touchable>
          <Touchable onPress={this.logoutAndReload}>
            <Text style={[styles.errorText, { textDecorationLine: 'underline' }]}>Restart the app and log out</Text>
          </Touchable>
        </View>
      )
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root />
        </PersistGate>
      </Provider>
    );

    /*
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Username</Text>
        <TextInput placeholder="Username" onChangeText={this.onChange} value={this.state.text} />
        <Text style={styles.label}>Password</Text>
        <TextInput placeholder="Password" onChangeText={this.onChange} value={this.state.text} />
        <TouchableOpacity style={styles.button}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
    */
  }
}

export { store };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#dddddd',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    marginHorizontal: 30,
    textAlign: 'center',
    fontSize: 18,
    color: '#4f4f4f',
  },
  errorInfoText: {
    marginHorizontal: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#4f4f4f',
  },
});
