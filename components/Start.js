import React from 'react';
import { ImageBackground, View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
  
  state = { name: '', colour: '' };

  render() {
    return (
      <ImageBackground source={require('../assets/Background_Image.png')} style={{flex: 1, padding: "6%"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ChatApp</Text>
        </View>
        <View style={styles.contentContainer}>
          <TextInput style={styles.nameInput} placeholder="Your Name" accessible={true} accessibilityLabel="Enter your name" accessibilityHint="Sets your name on the chat screen"
            onChangeText={(name) => this.setState({name})} 
          />          
          <Text style={styles.chooseText}>Choose Background Colour:</Text>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', height: "25%", paddingBottom: "3%"}}>
            <TouchableOpacity style={styles.color1} accessible={true} accessibilityLabel="Select black" accessibilityHint="Sets chat screen background to black" accessibilityRole="button"
              onPress={() => this.setState({ colour: '#090C08'})}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#474056",}]} accessible={true} accessibilityLabel="Select dark grey" accessibilityHint="Sets chat screen background to dark grey" accessibilityRole="button"
              onPress={() => this.setState({ colour: '#474056'})}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#8A95A5",}]} accessible={true} accessibilityLabel="Select grey-blue" accessibilityHint="Sets chat screen background to grey-blue" accessibilityRole="button"
              onPress={() => this.setState({ colour: '#8A95A5'})}>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#5F79A3",}]} accessible={true} accessibilityLabel="Select light green" accessibilityHint="Sets chat screen background to light green" accessibilityRole="button"
              onPress={() => this.setState({ colour: '#5F79A3'})}>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} accessible={true} accessibilityLabel="Start chatting" accessibilityHint="Navigates to chat screen" accessibilityRole="button"
            onPress={() => this.props.navigation.navigate('Chat', 
            { name: this.state.name, colour: this.state.colour })}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
  },
  contentContainer: {
    backgroundColor: "#fff",
    padding: "6%",
    width: "100%",
    position: "absolute",
    bottom: "6%",
    left: "6%",
    flex: 1
  },
  nameInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 50,
    borderColor: "#757083",
    borderWidth: 2,
    paddingHorizontal: "6%",
    height: "25%",
  },
  chooseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757083",
    opacity: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  color1: { // color1 is inherited for each input with the backgroundColor then over-ridden
    backgroundColor: "#090C08",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  button: { // I am calling the class name button but note that a TouchableOpacity component has been used instead of a button to apply the styles specified in the brief
    backgroundColor: '#8A95A5',
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "6%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  }
})