import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import { navigate } from '../navigation/NavigationService';
import { clearState, dispatchToProps } from '../redux/util';
import Touchable from '../components/Touchable';

class Home extends Component {
  logout = () => this.props.logout(false, true)
  toChatBot = () => {
    navigate('ChatScreen');
  }
  toImportContacts = () => {
    navigate('ImportContacts');
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#eeeeee', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
        <Touchable onPress={this.toImportContacts} style={{ backgroundColor: '#222E48', borderRadius: 5, padding: 10, alignSelf: 'stretch', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ color: 'white' }}>Import Contacts</Text>
        </Touchable>
        <Touchable onPress={this.toChatBot} style={{ backgroundColor: '#222E48', borderRadius: 5, padding: 10, alignSelf: 'stretch', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ color: 'white' }}>Chat Bot</Text>
        </Touchable>
        <Touchable onPress={this.logout} style={{ backgroundColor: '#222E48', borderRadius: 5, padding: 10, alignSelf: 'stretch', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ color: 'white' }}>Logout</Text>
        </Touchable>
      </View>
    );
  }
}

const mapDispatchToProps = dispatchToProps({ logout: clearState });
export default connect(null, mapDispatchToProps)(Home);
