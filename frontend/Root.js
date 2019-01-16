import React, { Fragment, PureComponent } from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { AppLoading, Asset } from 'expo';

import { setTopLevelNavigator, navigate } from './navigation/NavigationService';
import RootNavigator from './navigation/RootNavigation';

const navigateSession = session => navigate(session ? 'Home' : 'Signup', { session });

class Root extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { session } = nextProps;
    if (session !== prevState.session) navigateSession(session);
    return { session };
  }

  constructor(props) {
    super(props);
    this.state = { session: null, loading: true };
  }

  loadAssets = () => (
    Promise.all([
      Asset.loadAsync([
        // require('./assets/images/image.png'),
      ])
    ])
  );

  doneLoading = () => this.setState({ loading: false }) ;

  renderLoading = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );

  loadingError = (error) => {
    console.warn('Loading error', error);
    this.setState({ loading: false });
  };

  setRef = async (el) => {
    await setTopLevelNavigator(el);
    navigateSession(this.props.session);
  };

  render() {
    const { me, navigationKey } = this.props;

    if (this.state.loading) {
      return (
        <AppLoading
          startAsync={this.loadAssets}
          onError={this.loadingError}
          onFinish={this.doneLoading}
        />
      );
    }

    return (
      <Fragment>
        {Platform.OS === 'ios' && <StatusBar barStyle={me ? 'light-content' : 'default'} />}
        <RootNavigator
          ref={this.setRef}
          persistenceKey={navigationKey}
          renderLoadingExperimental={this.renderLoading}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ navigationKey, user: { me, session } }) => ({
  navigationKey,
  session,
  me
});
export default connect(mapStateToProps)(Root);
