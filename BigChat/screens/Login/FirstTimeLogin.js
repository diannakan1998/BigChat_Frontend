import React from 'react';
import { View, ListView,AsyncStorage, StyleSheet, Text, Image,TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import ImagePicker from 'react-native-image-picker';
// import Footer from './Footer';
import Button from 'apsl-react-native-button';
import t from 'tcomb-form-native'; // 0.6.9
var FileUpload = require('NativeModules').FileUpload;

const Form = t.form.Form;

const styles = StyleSheet.create({
    form: {
        justifyContent: 'center',
        width: 300,
        padding: 20,
        backgroundColor: '#ffffff',
      },
    buttonStyle1: {
        borderColor: '#d35400',
        backgroundColor: '#e98b39'
      },
      buttonStyle2: {
        borderColor: '#c0392b',
        backgroundColor: '#e74c3c'
      },
    buttonStyle3: {
        borderColor: '#16a085',
        backgroundColor: '#1abc9c'
    },
    buttonStyle4: {
        borderColor: '#27ae60',
        backgroundColor: '#2ecc71',
        marginBottom: 150,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        // marginTop: 20,
    },
    textStyle: {
        color: 'white'
    },
    username: {
        marginTop: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
      //  color: '#00bfff'
    },
    profilephoto: {
        alignSelf: 'center',
        height: 200,
        width: 200,
        borderWidth: 1,
        borderRadius: 100,
        marginTop:20,
    },
    toolbar: {
        backgroundColor: '#00bfff',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1
    }
});

const User = t.struct({
    username: t.String,
  });

export default class FirstTimeLogin extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isFetching:true,
            avatarSource: null,
            videoSource: null,
            userData: null,
            imgBase64: '',
        };
    }
    componentDidMount() {
        this._retrieveAvatar();

      }
    render() {
        if(this.state.isFetching){
            return (
                    <View style={{ flex: 1 }}>
                        <View style={styles.toolbar}>
                            <Text style={styles.toolbarTitle}>Profile</Text>
                        </View>
                        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        </TouchableOpacity>
                        <Text style={styles.username}>  </Text>
                        <View style={styles.container}>
                            <Button style={styles.buttonStyle1} textStyle={styles.textStyle}
                                onPress={this.selectPhotoTapped.bind(this)}>
                                Select new Profile Image
                            </Button>
                            <Button  style={styles.buttonStyle2} textStyle={styles.textStyle} 
                                onPress ={this._sendAvattar}>
                                Save 
                            </Button>
                        </View>
                        {/* <Footer /> */}
                    </View>
            );
        }
        else 
        {return (
            <View style={{ flex: 1 }}>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>Profile</Text>
                </View>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    {this.state.imgBase64 == '' ?
                        <Image source={{ uri: 'data:image/jpeg;base64,'+this.state.userData.picture }} style={styles.profilephoto} />
                        : <Image source={{uri:'data:image/jpeg;base64,'+this.state.imgBase64}} style={styles.profilephoto} />}
                </TouchableOpacity> 
                {/* <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}> */}
                <Text style={styles.username}> {this.state.userData.email} </Text>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <Form ref={(ref) => this._formRef=ref} type={User}  /> 
                    </View>
                    <Button style={styles.buttonStyle3} textStyle={styles.textStyle}
                        onPress={this.selectPhotoTapped.bind(this)}>
                        Select new Profile Image
                        </Button>
                     <Button  style={styles.buttonStyle4} textStyle={styles.textStyle}
                        onPress ={this._sendAvattar.bind(this)}>
                        Save
                    </Button>
                </View>
                {/* </TouchableWithoutFeedback> */}
                </KeyboardAvoidingView>
                {/* <Footer /> */}
            </View>

        );}
    }

    //Choose picture 
    selectPhotoTapped() {
        const options = {
            title: 'Choose Photos',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Take Photos',
            chooseFromLibraryButtonTitle: 'Choose Image from Photo Library',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'imagess',
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    imgBase64: response.data,
                });  
               
            }
        });

    }


    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            alert(error);
            return null;
        }}

    _retrieveAvatar = () => {
        this._retrieveData("userData").then((userData) => {
        userData = JSON.parse(userData);
        //userData.token = "Token1"; //CHANGE THIS
        try {
        let req = fetch("http://40.118.225.183:8000/Contact/Profile/?email="+ userData.email, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => {
            // alert(response._bodyText)
            let avatar = response._bodyText;
            avatar = JSON.parse(avatar);
            userData.picture = avatar.image;
            //userData.name = userData.email;
            this.setState(
                {
                    userData:userData,
                    user_name: userData.name,
                    isFetching:false,
                });
       
        });

    } catch (exp) {
        alert(exp);
    }

    });
    }

    _sendAvattar = async() => {
        var value = this._formRef.getValue();
        if(value)
            {
                // alert(value.username)
                let picture = encodeURIComponent(this.state.imgBase64);
                // alert("sending")
            try {
                let req = await fetch("http://40.118.225.183:8000/Contact/Profile/?token=" +this.state.userData.token+ "&email=" + this.state.userData.email + "&image=" + picture + "&name="+value.username, {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                    },
                });
   
                this.props.navigation.navigate("App");
            } catch (exp) {
                alert(exp);
                this.setState(
                    {
                        isFetching: false,
                    });
            }
        }
        else alert("Need to enter a username!");

     }

    //Choose video 
    selectVideoTapped() {
        const options = {
            title: 'Choose Video',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Record Video',
            chooseFromLibraryButtonTitle: 'Choose Video',
            mediaType: 'video',
            videoQuality: 'medium'
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    videoSource: response.uri
                });
            }
        });
    }

}