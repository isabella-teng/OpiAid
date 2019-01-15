import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default class App extends Component {
  static getDerivedStateFromProps() {
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange = text => {
    this.setState({ text });
  }

  render() {
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
  }
}

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
  }
});
