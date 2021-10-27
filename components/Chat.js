import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'; // Bubble component needed to customize the message bubbles

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: this.props.route.params.name, // Initialise state with name received as props from navigate method in Start screen
      colour: this.props.route.params.colour, // Initialise state with colour received as props from navigate method in Start screen
      messages: [] // Set initial messages state to empty array. Data then fetched within componentDidMount()
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({ title: this.state.name }); // Setting the header text shown on the screen
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

  onSend(newMessage = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, newMessage),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{ right: {backgroundColor: '#000'} }}/>
    )
  }
  
  render() {

    return (
      <View style={{flex: 1, backgroundColor: this.state.colour}}>
        <GiftedChat 
          messages={this.state.messages} 
          onSend={newMessage => this.onSend(newMessage)}
          renderBubble={this.renderBubble}
          user={{_id: 1}}/>  
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
      </View>
      
    )
  }
}