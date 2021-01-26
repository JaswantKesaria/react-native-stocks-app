import React, { Component } from 'react';
import {StyleSheet,View, Text, TouchableOpacity} from 'react-native';
import {
    GoogleSignin,
    statusCodes,
  } from '@react-native-community/google-signin';
class GoogleSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTouchSelected: false,
      loggedIn: false,
      userInfo: []
    };
  }
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const info = await GoogleSignin.signIn();
      this.setState({userInfo: info, loggedIn:true});
    } catch (error) {
        console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({loggedIn: false,userInfo: []});
     } catch (error) {
      console.error(error);
    }
  };
 
  componentDidMount() {
    GoogleSignin.configure({
        scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
        webClientId:
          '567611121130-brv8g4mnhe085mt8o14jqi384h3ipbv5.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      });
  }
  navigateTo(path) {
    this.props.navigation.navigate(path)
  }
 
  render = () => {
      if(this.state.loggedIn){
         this.navigateTo('stocks');
      }
    return(
    <>
    <View  style={styles.container}>
    <View style={styles.signInContainer}> 
    <TouchableOpacity onPress={this.signIn.bind()} style={styles.signInBackground}>
            <Text style={styles.googleStyles}> 
             <Text style={{fontSize:24}}> G  </Text>
             Sign In with Google </Text> 
        
    </TouchableOpacity>
    </View>
   
        </View>
        {/* {!this.state.loggedIn && <Text>You are currently logged out</Text>}
              {this.state.loggedIn && (
                <Button
                  onPress={this.signOut.bind()}
                  title="LogOut"
                  color="red"></Button>
              )} */}
        
   
    </>
    );
  }
}

 
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#413174',
      },
      signInContainer:{
          flex:1,
          flexDirection:'column',
          justifyContent:'center'
      },
      signInBackground: {
          zIndex: 999,
          backgroundColor:'#756B95',
          borderRadius:25, 
          width:250,
           padding: 12
      },
      googleStyles:{
          fontWeight:'bold',
          fontSize:19,
          color:'white',
          textAlign:'center'
      }
});
export default GoogleSign;