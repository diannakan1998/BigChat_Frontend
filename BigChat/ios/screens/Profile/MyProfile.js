import React from 'react';
import { View, ListView,AsyncStorage, StyleSheet, Text, Image,TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Footer from './Footer';
import Button from 'apsl-react-native-button';
var FileUpload = require('NativeModules').FileUpload;

const styles = StyleSheet.create({
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
        backgroundColor: '#2ecc71'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
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

const Udata = {
    name: "Bill Gates",
    picture: "https://randomuser.me/api/portraits/men/4.jpg",
    googleAccount: "BillGates@google.com",
    UserId: "123456",
};

export default class Profile extends React.Component {
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
                                Upload new Profile Image 
                            </Button>
                        </View>
                        <Footer />
                    </View>
            );
        }
        else 
        {return (
            <View style={{ flex: 1 }}>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>Profile</Text>
                </View>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    {this.state.imgBase64 == '' ?
                        <Image source={{ uri: 'data:image/jpeg;base64,'+this.state.userData.picture }} style={styles.profilephoto} resizeMode="stretch" />
                        : <Image source={{uri:'data:image/jpeg;base64,'+this.state.imgBase64}} style={styles.profilephoto} resizeMode="stretch" />}
                </TouchableOpacity>
                <Text style={styles.username}> {this.state.userData.name} </Text>
                <View style={styles.container}>
                    <Button style={styles.buttonStyle3} textStyle={styles.textStyle}
                        onPress={this.selectPhotoTapped.bind(this)}>
                        Select new Profile Image
                        </Button>
                     <Button  style={styles.buttonStyle4} textStyle={styles.textStyle}
                        onPress ={this._sendAvattar}>
                        Upload new Profile Image 
                    </Button>
                </View>
                <Footer />
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
        let req = fetch("http://40.118.225.183:8000/Contact/Profile/?email="+userData.email , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => {

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
        alert("nonononoo");
    }

    });
    }

    _sendAvattar = async() => {
        if(this.state.imgBase64!='')
                {let picture = encodeURIComponent(this.state.imgBase64);
                    //alert("sending")
                try {
                let req = fetch("http://40.118.225.183:8000/Contact/Profile/?token="+this.state.userData.token+"&email=" + this.state.userData.email + "&image=" + picture + "&name="+this.state.user_name, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                })
            } catch (exp) {
                this.setState(
                    {
                        isFetching: false,
                    });
            }}
        else alert("Profile image is not selected!");
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