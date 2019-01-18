import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Expo from 'expo';

import { clearState, dispatchToProps } from '../redux/util';


let window = Dimensions.get('window');
const contentHeight = window.height - 80;

class ChatScreen extends Component {
  state = {
     messages: [], answers: [], height: contentHeight
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi there!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        }
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.getDialogFlow(messages[0].text)
  }
  async getDialogFlow(msg) {
    const ACCESS_TOKEN = '53fd32522d5d40029df877e0a04873b1';

    try {
       const response = await fetch(`https://api.dialogflow.com/v1/query?v=20170712`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          query: msg,
          lang: 'en',
          sessionId: 'somerandomthing'
        })
      })
      let responseJson = await response.json();

      const imageUrl = null;

      responseJson.result.fulfillment.messages.map((item, i) => {
         if (item.payload !== undefined){
            if(item.payload.imageUrl !== undefined) {
              imageUrl = item.payload.imageUrl;
            }
        }
        return imageUrl
      })

      let answers = [
        {
          _id: responseJson.id,
          text: responseJson.result.fulfillment.speech,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Botler',
            avatar: 'https://placeimg.com/140/140/any',
          },
          image: imageUrl,
          imageProps: {
             height: 200,
             width: 200
          }
        },
      ]

      Expo.Speech.stop()
      Expo.Speech.speak(responseJson.result.fulfillment.speech)

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, answers),
      }))

      return responseJson;

    } catch(error) {
      console.error(error);
    }
  }

  renderChat = () => (
    <GiftedChat
      textInputProps={{autoFocus: true}}
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: 1 }}
        />
        {Platform.OS === 'android' && <KeyboardSpacer />}
      </View>
    );
  }
}

const mapDispatchToProps = dispatchToProps({ logout: clearState });
export default connect(null, mapDispatchToProps)(ChatScreen);
