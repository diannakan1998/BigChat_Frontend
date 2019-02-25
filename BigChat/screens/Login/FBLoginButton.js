import React, { Component } from 'react';
import { Alert, View, Button } from 'react-native';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

export default class FBLoginButton extends Component {

state = {

    data : {
        name: "", // Name
        email: "", // Email Address
        user_id: "",   // User's Name
        app_id: "", // app_id (FB or Google)
        token: "", // Authentication Token
        authType: "facebook",   // Token issuer (FB or Google)
    }


}

    //Create response callback.
    _responseInfoCallback = (error, result) => {
        console.log("CallBack");
        if (error) {
            console.log("Failure");
            console.log('Error fetching data: ' + error.toString());
        } else {

            // alert('Success fetching data: ' + result.toString());
            console.log("Success");
            console.log(result);

            this.state.data.name = result.name;
            this.state.data.email = result.email;
            this.state.data.user_id = result.id;


            // const { onLogin } = this.props;
            this.props.onLogin(this.state.data);


        }
    }

    //   // Don't need it...
    //   _fbAuth() {
    //     LoginManager.logInWithReadPermissions(['public_profile','email']).then(function (result) {
    //       if (result.isCancelled) {
    //         // Alert.alert("Login Cancelled");
    //       } else {
    //         // Alert.alert("Login Success permission granted:" + result.grantedPermissions);
    //       }
    //     }, function (error) {
    //       Alert.alert("Some error occurred!\n" +  error);
    //     })
    //   }

    render() {
        return (
            <View>

                {/* <Button
                    onPress={this._fbAuth}
                    title="Login With Facebook"
                    color="#4267B2"
                /> */}

                <LoginButton
                    style = {{width:220,height:40}}
                    readPermissions={["email"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login error: " + result.error);
                                console.log("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                console.log("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        console.log(data);
                                        
                                        this.state.data.token = data.accessToken.toString();
                                        this.state.data.app_id = data.applicationID;

                                        const infoRequest = new GraphRequest(
                                            '/me',
                                            {
                                                parameters: {
                                                    fields: {
                                                        string: 'email,name,first_name,middle_name,last_name' // what you want to get
                                                    },
                                                    access_token: {
                                                        string: data.accessToken.toString() // put your accessToken here
                                                    }
                                                }
                                            },
                                            this._responseInfoCallback
                                        );
                                        // Start the graph request.
                                        new GraphRequestManager().addRequest(infoRequest).start();

                                    }
                                )
                            }
                        }
                    }
                    onLogoutFinished={() => console.log("logout.")} />
            </View>
        );
    }
}

module.exports = FBLoginButton;