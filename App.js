/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Authenticate from './Components/authenticate';
import GoogleSign from './Components/googleSign'
import Stocks from './Components/stocks'
import SpeechToText from './Components/speechToText'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

class App extends React.Component{
  state = {
   displayStock : false,
  }

  displayStockChange() {
    this.setState({displayStock: true});
  }
   componentDidMount() {
    console.log("App.js mounting to be implemented");
  }
  render(){
   //return( <Authenticate/>);
   return(
   <NavigationContainer>
      <Stack.Navigator initialRouteName="authenticate" screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="authenticate" component={Authenticate} />
        <Stack.Screen name="googlesign" component={GoogleSign} />
        <Stack.Screen name="stocks" component={Stocks} />
        <Stack.Screen name="stt" component={SpeechToText} />
      </Stack.Navigator>
    </NavigationContainer>
   );
   
  }
  
};

export default App;
