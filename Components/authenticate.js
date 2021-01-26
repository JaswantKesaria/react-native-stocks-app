import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import GoogleSign from './googleSign';
import Biometric from './biometric';

 
 
class Authenticate extends Component {
  constructor(props) {
    super(props);
        this.state = {
      isTouchSelected: false,
    };
  }
 
  componentDidMount() {
  }
  biometricSelected() {
      if(this.state.isTouchSelected){
          this.setState({isTouchSelected: false})
      }
      this.setState({isTouchSelected: true});
  }
  navigateTo(path) {
    this.props.navigation.navigate(path)
  }
  render = () => {
      if(this.state.renderSignIn){
        this.navigateTo('googlesign')
      }
    return(
    <>
    <View  style={styles.container}>
        <View style={styles.ImageContainer}>
            <Image source={require('../assests/AuthenticatewithFaceId.png')} />
        </View>
        <View style={styles.ImageContainer}>
           <Text style={styles.infoStyleBold}>
               Login with Face ID
           </Text>
           <Text style={styles.infoText}>Use your Face ID for faster,easier acccess to signin</Text>
        </View>
        <View style={styles.ImageContainer}>
            <TouchableOpacity  style={styles.faceIdStyle} onPress={() => {this.biometricSelected()}}>
                <Text style={styles.buttonText}>
                 Use Face ID
                </Text>
                </TouchableOpacity>
            <TouchableOpacity style={styles.notNowStyle} onPress={() => {this.navigateTo('googlesign')}}>
                <Text style={styles.notNowtext}>
                    Not now
                </Text>
            </TouchableOpacity>
        </View>
        {
            (this.state.isTouchSelected)? <Biometric onAuthenticate={() => this.navigateTo('googlesign')}/> : null
        }
    </View>
    </>
    );
  }
}

 
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      ImageContainer: {
        flex:0.6,
        justifyContent: 'center',
        alignItems: 'center',
      },
      faceIdStyle:{
        marginVertical: 10,
        width: 300,
        padding: 10,
        backgroundColor:'#413174'
      },
      notNowStyle:{
        marginVertical: 10,
        width: 300,
        padding: 10,
        borderWidth: 1,
        borderStyle:'solid',
        borderColor: '#413174',
      },
      buttonText: {
        textAlign:'center',
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
      },
      notNowtext: {
        textAlign:'center',
        color: '#413174',
        fontSize: 15,
        fontWeight: 'bold',
      },
      infoStyleBold:{
        color: '#413174',
        fontWeight: 'bold',
      },
      infoText:{
        color: '#413174',
      }
});
export default Authenticate;