import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth');
import { GiftedChat, Bubble } from 'react-native-gifted-chat'; // Bubble component needed to customize the message bubbles

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: this.props.route.params.name, // Initialise state with name received as props from navigate method in Start screen
      colour: this.props.route.params.colour, // Initialise state with colour received as props from navigate method in Start screen
      messages: [], // Set initial messages state to empty array. Data then fetched within componentDidMount()
      uid: 0,
      loggedInText: 'Logging in...'
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({ // Initialise the app by passing the config object provided by Firebase to the initialize app function
        apiKey: "AIzaSyAUUEaqS1CoGE0hriIAGgC_i7MC5dQWDt0",
        authDomain: "chatapp-fccd8.firebaseapp.com",
        projectId: "chatapp-fccd8",
        storageBucket: "chatapp-fccd8.appspot.com",
        messagingSenderId: "615418284505",
        appId: "1:615418284505:web:57eebbf12fc662eb1431c8"
      });
    }
    this.messagesCollection = firebase.firestore().collection('messages');
  }

  componentDidMount() {
    this.props.navigation.setOptions({ title: this.state.name }); // Setting the header text shown on the screen
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      };
      this.setState({
        uid: user.uid,
        loggedInText: 'Welcome',
      });
    });
    this.unsubscribeMessagesCollection = this.messagesCollection.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => { // when the database is updated set the messages state with the current data from the snapshot
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages
    });
  };

  onSend(newMessage = []) { // onSend triggers the add message function to update the database. The database listener then triggers a state update using onCollectionUpdate when the new message is detected
    this.addMessage(newMessage)
  }

  addMessage(newMessage) {
    this.messagesCollection.add({ // Use add method to add new message to the messages collection
      _id: newMessage._id,
      text: newMessage.text,
      createdAt: newMessage.createdAt,
      user: {
        _id: newMessage.user._id,
        name: newMessage.user.name,
        avatar: newMessage.user.avatar
      }
    });
  }

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{ right: {backgroundColor: '#8aa59a'} }}/>
    )
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeMessagesCollection();
 }
  
  render() {

    return (
      <View style={{flex: 1, backgroundColor: this.state.colour}}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat 
          messages={this.state.messages} 
          onSend={newMessage => this.onSend(newMessage)}
          renderBubble={this.renderBubble}
          user={{ _id: this.state.uid }}/>  
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
      </View>
      
    )
  }
}