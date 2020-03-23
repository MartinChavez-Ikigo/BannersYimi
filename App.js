import React, {Component} from "react";
import AppNavigator from "./navigation/AppNavigator";
import {createAppContainer} from "react-navigation";
import { StyleSheet, Text, View, TextInput,AppState,Vibration,TouchableOpacity,Switch,ScrollView,Button} from 'react-native';
const AppConatiner = createAppContainer(AppNavigator);

export default class App extends Component{

  render(){
      return (<AppConatiner>
               
             </AppConatiner>
      );
      
  }

}



