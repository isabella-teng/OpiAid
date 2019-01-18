import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StyleSheet,
  Platform,
  Text,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { sha256 } from 'js-sha256';

import ErrorBar from '../components/ErrorBar';
import Touchable from '../components/Touchable';
import { dispatchToProps } from '../redux/util';
import { post } from '../util/util';
import { startSession, getMe } from '../redux/user';

const { height, width } = Dimensions.get('window');

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      isLogin: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  login = async () => {
    if (!this.validInput()) return;
    Keyboard.dismiss();

    this.setState({ loading: true });

    const { username, password } = this.state;
    const route = this.state.isLogin ? '/login' : '/signup';
    const { status, message, data } = await post(route, { username, password: sha256(password) });

    if (status === 'success') {
      this.props.startSession(data.session);
      await this.props.getMe();
    } else {
      this.setState({ error: message });
    }

    this.mounted && this.setState({ loading: false });
  };

  validInput = () => this.state.username.length >= 2 && this.state.password.length >= 2;

  usernameChange = username => this.setState({ username });
  passwordChange = password => this.setState({ password });
  usernameSubmitted = () => this.passwordInput && this.passwordInput.focus();
  setPasswordInputRef = ref => (this.passwordInput = ref);
  toggleLogin = () => this.setState(({ isLogin }) => ({ isLogin: !isLogin }));


  render() {
    const validInput = this.validInput();
    const buttonTextStyle = validInput ? { color: '#fff' } : {};

    return (
      <Touchable style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={[styles.title, { alignSelf: 'flex-start' }]}>OPIAID</Text>

        <ErrorBar error={this.state.error} />

        <TextInput
          returnKeyType="next"
          maxLength={100}
          onChangeText={this.usernameChange}
          placeholder="Username"
          placeholderTextColor="#8C8C8C"
          value={this.state.username}
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
          onSubmitEditing={this.usernameSubmitted}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <TextInput
          ref={this.setPasswordInputRef}
          returnKeyType="done"
          maxLength={100}
          onChangeText={this.passwordChange}
          placeholder="Password"
          placeholderTextColor="#8C8C8C"
          value={this.state.password}
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
          onSubmitEditing={this.login}
          style={[styles.textInput, { marginTop: 10 }]}
          autoCorrect={false}
          secureTextEntry
        />

        <Touchable style={styles.shortButton} onPress={this.login} feedback disabled={!validInput || this.state.loading}>
          <Text style={[styles.shortButtonText, buttonTextStyle]}>{this.state.isLogin ? 'Log in' : 'Register'}</Text>
          {this.state.loading && <ActivityIndicator style={{ position: 'absolute', right: 20 }} />}
        </Touchable>

        <Touchable onPress={this.toggleLogin} feedback>
          <Text style={styles.smallText}>{this.state.isLogin ? 'Don\'t have an account? Register!' : 'Already have an account? Log in!'}</Text>
        </Touchable>
      </Touchable>
    );
  }
}

const mapDispatchToProps = dispatchToProps({ startSession, getMe });
export default connect(null, mapDispatchToProps)(Signup);

const styles = StyleSheet.create({
  shortButton: {
    paddingHorizontal: 60,
    height: 42,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222E48',
    marginTop: 30,
    marginBottom: 20,
  },
  shortButtonText: {
    color: '#DBEBF7',
    fontWeight: '500',
    fontSize: 16,
  },
  smallText: {
    color: '#8C8C8C',
    fontSize: 14,
    marginBottom: 10,
  },
  container: {
    ...Platform.select({
      android: { height, width },
      ios: { flex: 1 },
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 60,
    paddingTop: 80,
  },
  title: {
    fontSize: 37,
    color: '#222E48',
    textAlign: 'left',
    marginBottom: 10,
    fontWeight: '800',
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#F2F2F4',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
