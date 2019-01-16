import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import { clearState, dispatchToProps } from '../redux/util';
import Touchable from '../components/Touchable';

class Home extends Component {
  logout = () => this.props.logout(false, true)

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
        <Touchable onPress={this.logout} style={{ backgroundColor: 'blue', borderRadius: 5, padding: 10 }}>
          <Text>Logout</Text>
        </Touchable>
      </View>
    );
  }
}

const mapDispatchToProps = dispatchToProps({ logout: clearState });
export default connect(null, mapDispatchToProps)(Home);
