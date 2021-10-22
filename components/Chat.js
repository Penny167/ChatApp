import React from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  
  render() {

    const name = this.props.route.params.name; // Get the name from the props passed by the navigate method in Screen1
    this.props.navigation.setOptions({ title: name }); // Setting the header text shown on the screen  
    const colour = this.props.route.params.colour; // Taking colour selected by user to set the background screen colour

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colour}}>
        <Text>Hello {name}!</Text>
      </View>
    )
  }
}