import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {

  state = { messages: [] };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{ right: {backgroundColor: '#000'} }}/>
    )
  }
  
  render() {

    const name = this.props.route.params.name; // Get the name from the props passed by the navigate method in Screen1
    this.props.navigation.setOptions({ title: name }); // Setting the header text shown on the screen  
    const colour = this.props.route.params.colour; // Taking colour selected by user to set the background screen colour

    return (
      <View style={{flex: 1, backgroundColor: colour}}>
        <GiftedChat 
          messages={this.state.messages} 
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble}
          user={{_id: 1}}/>  
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
      </View>
      
    )
  }
}