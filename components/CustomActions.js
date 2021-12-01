import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';


export default class CustomActions extends React.Component {

  onActionPress = () => {
    const options = ['Choose Image', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({ options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  }

  pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(permissionResult.granted === true) {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images' });
        if (result.cancelled === false) {
          const imageUrl = await this.getImageUrl(result.uri); // Obtains the Url of the image from Firebase storage
          this.props.onSend({ image: imageUrl }); // Passes the Url to the current message to populate the image property onSend via props
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const imagePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(cameraPermission.granted && imagePermission.granted === true) {
        const result = await ImagePicker.launchCameraAsync();
        if (result.cancelled === false) {
          const imageUrl = await this.getImageUrl(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if(status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({ location: { longitude: longitude, latitude: latitude } });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  getImageUrl = async (uri) => {
    try {
      const response = await fetch(uri); // Fetch the image from the local uri 
      const blob = await response.blob(); // Convert to blob
      const splitUri = uri.split("/"); // Split the uri in to array of parts
      const imageName = splitUri[splitUri.length-1]; // Select URL part
      const ref = firebase.storage().ref().child(`images/${imageName}`); // Create reference to where image will be stored in Firebase storage
      const storeBlob = await ref.put(blob); // Put blob in to storage
      return await storeBlob.ref.getDownloadURL(); // Retrieve URL of stored blob to attach to message when sent
    } catch (error) {
    console.log(error.message);
    }
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onActionPress}>
       <View style={[styles.wrapper, this.props.wrapperStyle]}>
         <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
       </View>
     </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  }
});

CustomActions.contextTypes = { //assigns the context object actionSheet and checks that this is a function
  actionSheet: PropTypes.func,
};