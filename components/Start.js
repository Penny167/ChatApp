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
        <KeyboardAvoidingView style={styles.contentContainer} behavior="height">
          <TextInput style={styles.nameInput} placeholder="Your Name"
            onChangeText={(name) => this.setState({name})} 
          />          
          <Text style={styles.chooseText}>Choose Background Colour:</Text>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: "6%"}}>
            <TouchableOpacity style={styles.color1} onPress={() => this.setState({ colour: '#090C08'})}></TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#474056",}]} onPress={() => this.setState({ colour: '#474056'})}></TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#8A95A5",}]} onPress={() => this.setState({ colour: '#8A95A5'})}></TouchableOpacity>
            <TouchableOpacity style={[styles.color1, {backgroundColor: "#B9C6AE",}]} onPress={() => this.setState({ colour: '#B9C6AE'})}></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} 
            onPress={() => this.props.navigation.navigate('Chat', 
            { name: this.state.name, colour: this.state.colour })}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 0.56,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
  },
  contentContainer: {
    flex: 0.44,
    backgroundColor: "#fff",
    padding: "6%",
    height: "44%"
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
    backgroundColor: '#757083',
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  }
})