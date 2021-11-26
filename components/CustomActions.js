import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


export default class CustomActions extends React.Component {

  render() {
    return (
      <TouchableOpacity>
        <View>
          <Text>+</Text>
        </View>
      </TouchableOpacity>
    )
  } 
}
