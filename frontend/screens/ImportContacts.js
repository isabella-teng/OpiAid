import { clearState, dispatchToProps } from '../redux/util';
import React, { Component } from "react";
import { AppRegistry, FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Container, Header, Content, List, ListItem, Separator } from "native-base";
import { connect } from 'react-redux';

const CONTACT_PAGE_SIZE = 100;

class ImportContacts extends Component {

    _rawContacts = {};

    state = {
      contacts: [],
      hasPreviousPage: false,
      hasNextPage: false,
      permission: null,
      refreshing: false,
    };

  async componentDidMount() {
    await this.checkPermissionAsync();
    await this.loadAsync();
  }

  checkPermissionAsync = async () => {
    const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
    this.setState({ permission: status === 'granted' });
  };

  loadAsync = async (restart = false) => {
    if (!this.state.permission || this.state.refreshing) {
      return;
    }
    this.setState({ refreshing: true });

    const pageOffset = restart ? 0 : this.state.contacts.length || 0;

    const pageSize = restart ? Math.max(pageOffset, CONTACT_PAGE_SIZE) : CONTACT_PAGE_SIZE;

    const payload = await Expo.Contacts.getContactsAsync({
      fields: [
        Expo.Contacts.PHONE_NUMBERS
      ],
      pageSize,
      pageOffset,
    });

    const { data: contacts, hasPreviousPage, hasNextPage } = payload;

    for (const contact of contacts) {
      this._rawContacts[contact.id] = contact;
    }

    this.setState({
      contacts: Object.values(this._rawContacts),
      hasPreviousPage,
      hasNextPage,
      refreshing: false,
    });
  };

  _showAlert = () => {
    alert('Alert Title')
  }

  _keyExtractor = (item, index) => item.id;


  render() {

    const { contacts, permission } = this.state;

    if (this.state.loading) {
        return (
          <Expo.AppLoading />
        );
    }

    return (
      <Container>
        <Content>
        <FlatList
           keyExtractor={this._keyExtractor}
           renderItem={({ item }) =>
            <ListItem>
              <Text>{item.name}</Text>
            </ListItem>
           }
           onEndReachedThreshold={-1.5}
           data={contacts.filter(x => x.firstName != null).sort((a,b) => {return a.firstName.localeCompare(b.firstName) })}
           onPressItem={this.onPressItem}
           onEndReached={this.loadAsync}
        />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
})


const mapDispatchToProps = dispatchToProps({ logout: clearState });
export default connect(null, mapDispatchToProps)(ImportContacts);
