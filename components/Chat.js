import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth');
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'; // Bubble component needed to customize the message bubbles
import CustomActions from './CustomActions';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: this.props.route.params.name, // Initialize state with name received as props from navigate method in Start screen
      colour: this.props.route.params.colour, // Initialize state with colour received as props from navigate method in Start screen
      messages: [], // Set initial messages state to empty array. Data then fetched within componentDidMount()
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
      loggedInText: 'Offline',
      isConnected: false,
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
    LogBox.ignoreLogs([ // To remove warning message in the console for Android re setting timer
      'Setting a timer',
      'Warning: ...',
      'undefined',
      'Animated.event now requires a second argument for options',
    ]);
  }

  componentDidMount() {
    this.props.navigation.setOptions({ title: this.state.name }); // Setting the header text shown on the screen
    NetInfo.fetch().then(connection => {
      if(connection.isConnected) {
        this.setState({ isConnected: true, loggedInText: 'Online' });
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) { await firebase.auth().signInAnonymously() };
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.state.name,
              avatar: 'https://placeimg.com/140/140/any'
            }
          });
          // Add a database listener that will retrieve a snapshot of the messages collection whenever a change is detected, and pass it to the onCollectionUpdate function
          this.unsubscribeMessagesCollection = this.messagesCollection.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  onCollectionUpdate = (querySnapshot) => { // when the database is updated set the messages state with the current data from the snapshot
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({ messages: messages }, () => { // setState is asynchronous so use callback parameter to invoke saveMessages only once the messages state has been updated
      this.saveMessages();
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
    console.log(error.message);
    }
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({ messages: JSON.parse(messages) });
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages () { // This has just been added in case needed to clear out asyncStorage periodically during development and testing
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(newMessage = []) { // onSend triggers the add message function to update the database. The database listener then triggers a state update using onCollectionUpdate when the new message is detected
  //  console.log(newMessage);
    this.addMessage(newMessage)
  }

  addMessage(newMessage) {
    const latestMessage = newMessage[0]; // A new message in Gifted Chat is an array containing a new message object. We therefore need to first extract the object from the array
    this.messagesCollection.add({ // Use add method to add new message to the messages collection
      _id: latestMessage._id,
      text: latestMessage.text,
      createdAt: latestMessage.createdAt,
      user: latestMessage.user
    });
  }

  renderBubble(props) { // Customizes the bubble styling
    return (
      <Bubble {...props} wrapperStyle={{ right: {backgroundColor: '#8aa59a'} }}/>
    )
  }

  renderInputToolbar(props) { // Input bar for messages only rendered if the user is online
    if(this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar {...props}/>
      );
    }
  }

  renderCustomActions = (props) => { // Returns action button to access communication features
    return <CustomActions {...props} />;
  };

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
          renderInputToolbar={this.renderInputToolbar}
          renderUsernameOnMessage={true}
          renderActions={this.renderCustomActions}
          user={{ 
            _id: this.state.uid, 
            name: this.state.name,
            avatar: 'https://placeimg.com/140/140/any' 
          }}/>  
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
      </View>
      
    )
  }
}