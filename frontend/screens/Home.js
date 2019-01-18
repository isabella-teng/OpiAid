import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import Overlay from 'react-native-modal-overlay';

import { navigate } from '../navigation/NavigationService';
import { clearState, dispatchToProps } from '../redux/util';
import Touchable from '../components/Touchable';

const icons = {
  home: require('../assets/images/icons8-home-page-90.png'),
  logout: require('../assets/images/icons8-sign-out-90.png'),
  chat: require('../assets/images/icons8-sms-90.png'),
  user: require('../assets/images/icons8-user-90.png'),
  gif: require('../assets/images/breathe.gif')
}

class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  state = {
    modalVisible: false,
  }

  logout = () => this.props.logout(false, true)
  toChatBot = () => navigate('ChatScreen');
  toImportContacts = () => navigate('ImportContacts');

  onClose = () => this.setState({ modalVisible: false});
  panic = () => this.setState({modalVisible: true});

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', paddingHorizontal: 20 }}>
        <View style={{ height: 40, margin: 30, flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
          <Touchable onPress={this.logout} style={{ alignItems: 'center', flexDirection: 'row' }} feedback>
            <Text style={[styles.buttonText, { color: '#484848', marginRight: 5 }]}>LOGOUT</Text>
            <Image source={icons.logout} style={[styles.icon, { tintColor: '#484848', height: 20, width: 20 }]} />
          </Touchable>
        </View>
        <LinearGradient
          colors={['#C1E1FF', '#C1D7FB', '#C2CCF7']}
          style={{ padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 100, marginBottom: 15 }}>
          <LinearGradient
            colors={['#9BCDFE', '#9CBDF8', '#83A4FF']}
            style={{ height: 160, width: 160, padding: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 80 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 60, color: '#fff' }}>
              136
            </Text>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
              day streak
            </Text>
          </LinearGradient>
        </LinearGradient>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center', justifyContent: 'center' }}>
          <Touchable onPress={this.toChatBot} style={styles.buttonContainer} feedback>
            <View style={styles.button}>
              <Image source={icons.chat} style={styles.icon} />
              <Text style={styles.buttonText}>Chat</Text>
            </View>
          </Touchable>
          <Touchable onPress={this.toImportContacts} style={styles.buttonContainer} feedback>
            <View style={styles.button}>
              <Image source={icons.user} style={styles.icon} />
              <Text style={styles.buttonText}>Contacts</Text>
            </View>
          </Touchable>
          <Touchable style={styles.bigButton} onPress={this.panic} feedback>
            <View style={[styles.button, styles.wideButton]}>
              <Overlay visible={this.state.modalVisible} onClose={this.onClose}
                containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                animationType="zoomIn"
                childrenWrapperStyle={{backgroundColor: '#eee', height: 300, borderRadius: 20}}
                animationDuration={500}
                >
                {
                  (hideModal, overlayState) => (
                    <Fragment>
                      <View>
                        <Image source={icons.gif} style={{height: 200, width: 200}} resizeMode='contain'/>
                        <Button onPress={hideModal} title='Close'/>
                      </View>
                    </Fragment>
                  )
                }
              </Overlay>
              <Text style={[styles.buttonText, { fontSize: 20, fontWeight: 'bold' }]}>Panic!</Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatchToProps({ logout: clearState });
export default connect(null, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '50%',
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    height: 80,
    backgroundColor: '#83A4FF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideButton: {
    height: 60,
    marginVertical: 10,
    width: 234,
    flexDirection: 'row',
    backgroundColor: '#FD9B9F',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  icon: {
    height: 40,
    width: 40,
    tintColor: 'white'
  },
  bigButton: {
    width: '100%',
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(37, 8, 10, 0.78)',
    height: 800,
  },
});
