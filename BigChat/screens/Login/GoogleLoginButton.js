import React, { Component } from 'react';
import { Alert, View, Button } from 'react-native';

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

GoogleSignin.configure();

export default class GoogleLoginButton extends Component {

state = {

    data : {
        name: "", // Name
        email: "", // Email Address
        user_id: "",   // User's Name
        app_id: "", // app_id (FB or Google)
        token: "", // Authentication Token
        authType: "google",   // Token issuer (FB or Google)
    }

}

  // Signing in...
  signIn = async () => {
    try {
       
       await GoogleSignin.hasPlayServices();
       const userInfo = await GoogleSignin.signIn();
       this.setState({ userInfo });

       // Contains user info (email, name, picture (if null, use stock))
       console.log(userInfo);

       this.state.data.name = userInfo.user.name; // Name
       this.state.data.email = userInfo.user.email, // Email Address
       this.state.data.user_id = userInfo.user.id,  // Userid
       this.state.data.app_id = userInfo.idToken, // app_id
       this.state.data.token = userInfo.accessToken, // Authentication Token

       this.props.onLogin(this.state.data);

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // Alert.alert("SIGN IN CANCLED");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        // Alert.alert("SIGN IN IN_PROGRESS");

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // Alert.alert("SIGN PLAY_SERVICES_NOT_AVAILABLE");

      } else {
        // some other error happened
        Alert.alert("SIGN IN ERROR OTHER");

      }
    }
  };


  render() {
    return (
      <View>

       {/* <Button
          onPress={this.signIn}
          title="Login With Google"
          color={GoogleSigninButton.Color.Dark}
      /> */}

        <GoogleSigninButton
         // style={{width: 195, height: 40 }}
         style={{width:230, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={this.signIn}
          // disabled={this.state.isSigninInProgress} 
          />
 
      </View>
    );
  }
}

module.exports = GoogleLoginButton;