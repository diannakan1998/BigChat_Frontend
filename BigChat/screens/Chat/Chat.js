import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import IconF from 'react-native-vector-icons/Foundation';
import { Menu, MenuOption, MenuTrigger, MenuOptions, MenuProvider, opened, renderers } from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-picker';
import { Buffer } from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { View, Text, StyleSheet, Image, Button, AsyncStorage, } from 'react-native';
// import MapView from 'react-native-maps';
import CustomView from './CustomView'
import dismissKeyboard from 'dismissKeyboard';
var RNFS = require('react-native-fs');

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    toolbar: {
        backgroundColor: '#00bfff',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row' //Step 1
    },
    toolbarButton: {
        width: 50, //Step 2
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1 //Step 3
    },
});


export default class Chat extends Component {
    static navigationOptions = {
        header: null
    };
    token = "";
    state = {
        imageSource: "",
        user_name: "",
        messages: [],
        userData: {},
        isFetching: true,
        messageLength: 0,
        // userData,
        chatId: '',
        latitude: 0,
        longitude: 0,
        opened: false,
        visible: false,
        videoSource: null,
        audioFile: '',
        recording: false,
        loaded: false,
        paused: true,
        token: "this.props.navigation.state.params.token",
        audioStop: false,
    };

    constructor(props) {
        // this._retrieveData = this._retrieveData.bind(this);
 
        super(props);
        this._isMounted = false;
        this.token = this.props.navigation.state.params.token;
        // alert(this.token);
        // this._retrieveData("userData").then((data)=>{
            // this.setState({
            //     userData:JSON.parse(data),
            // });
            // alert("here");


            // alert("here");
        // });


    }


    backAndRefresh() {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    onBackdropPress() {
        this.setState({ opened: false });
    }
    onTriggerPress() {
        // GiftedChat.onKeyboardWillHide();
        dismissKeyboard();
        this.setState({ opened: true });
    }

    renderCustomView(props) {
        // alert(token);
        // alert(this.state.userData);
        let data = {
            props:props,
            // chatId: this.props.navigation.params.chatId,
            token: this.token,
            // go: ()=>this.goView(),
            // userData: this.state.userData,
        }
        return (
            
            <CustomView
                {...data}
            />
        );
    }

    render() {
        const { recording, paused, audioFile } = this.state;
        var imageURI = "";
        // var base64Icon = 'data:image/png;base64,' + base64Data;
        var { navigate } = this.props.navigation;
        var { goBack } = this.props.navigation;
        if (this.state.isFetching) {
            return (<View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Ionicons name='ios-arrow-back' size={25} style={{ color: '#fff', marginLeft: 5 }} />
                    <Text onPress={() => goBack()} style={styles.toolbarButton} >Back</Text>
                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`} </Text>
                    <Text onPress={() => navigate("ChatMenu", {})} style={styles.toolbarButton} >More</Text>
                </View>
            </View>);
        }
        else
            return (
                <MenuProvider style={{ flex: 1 }} >
                    <View style={styles.toolbar}>
                        <Ionicons name='ios-arrow-back' size={25} style={{ color: '#fff', marginLeft: 5 }} />
                        <Text onPress={() => this.backAndRefresh()} style={styles.toolbarButton} >Back</Text>
                        <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>
                        <Menu opened={this.state.opened} renderer={renderers.SlideInMenu} style={{ marginBottom: 10 }}>
                            <MenuTrigger onPress={() => this.onTriggerPress()}>
                                <Text style={styles.toolbarButton}>More</Text>
                                {/* <Ionicons name='md-more' size={30} style={styles.toolbarButton}/> */}
                            </MenuTrigger>
                            <MenuOptions>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <MenuOption onSelect={() => this.selectPhotoTapped("image")}>
                                        <Ionicons name='ios-image' size={25} style={{ color: 'grey', marginLeft: 10 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17 }}>Image</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.selectVideo()}>
                                        <Ionicons name='md-videocam' size={25} style={{ color: 'grey', marginLeft: 10 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, }}>Video</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.record()}>
                                        <Ionicons name='md-microphone' size={25} style={{ color: 'grey', marginLeft: 10 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, }}>Audio</Text>
                                    </MenuOption>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                                    <MenuOption onSelect={() => this.viewLocation()}>
                                        <Icon name='location' size={25} style={{ color: 'grey', marginLeft: 15 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, }}>Location</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.handleSnap()}>
                                        <Ionicons name='logo-snapchat' size={25} style={{ color: 'grey', marginLeft: 15 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 16, }}>SnapChat</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onBackdropPress()} >
                                        <Ionicons name='ios-close' size={25} style={{ color: 'grey', marginLeft: 20 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, marginLeft: 5 }}>Cancel</Text>
                                    </MenuOption>
                                </View>
                            </MenuOptions>
                        </Menu>
                        <Menu opened={this.state.visible} renderer={renderers.SlideInMenu}>
                            <MenuTrigger />
                            <MenuOptions style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                                {!this.state.audioStop ? (<MenuOption onSelect={this.start} disabled={recording}>
                                    <IconF name='record' size={25} style={this.state.recording ? { color: 'red', marginLeft: 15 }
                                        : { color: 'grey', marginLeft: 15 }} />
                                    <Text style={this.state.recording ? { textAlign: 'center', fontSize: 17, color: 'red' } :
                                        { textAlign: 'center', fontSize: 17 }}>Record</Text>
                                </MenuOption>)
                                    : (<MenuOption onSelect={() => this.sendAudio()}>
                                        <Ionicons name='ios-send' size={25} style={{ color: 'grey', marginLeft: 15 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, }}>Send</Text>
                                    </MenuOption>)}
                                {!this.state.audioStop ? (<MenuOption onSelect={this.stop} disabled={!recording}>
                                    <IconF name='stop' size={25} style={{ color: 'grey', marginLeft: 15 }} />
                                    <Text style={{ textAlign: 'center', fontSize: 17, }}>Stop</Text>
                                </MenuOption>)
                                    : (<MenuOption onSelect={this.play} disabled={!audioFile}>
                                        <IconF name='play' size={25} style={{ color: 'grey', marginLeft: 15 }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, }}>Play</Text>
                                    </MenuOption>)}
                                <MenuOption onSelect={() => this.setState({ visible: false })}>
                                    <Ionicons name='ios-close' size={25} style={{ color: 'grey', marginLeft: 20 }} />
                                    <Text style={{ textAlign: 'center', fontSize: 17, }}>Cancel</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                    <GiftedChat
                        keyboardShouldPersistTaps={'handled'}
                        messages={this.state.messages}
                        onSend={(text) => {
                            this._sendMessage(text, "text");
                            // this.imageMessageTest();
                        }}
                        alwaysShowSend= {true}
                        user={{ name: this.state.user_name, _id: this.state.user_name }}
                        renderCustomView={this.renderCustomView} />

                </MenuProvider>
            );
    }

    handleSnap = async () => {
        this.selectPhotoTapped("snap");
    }

    returnData = async (imageURI, type) => {
        if (this._isMounted)
            try {
                this.setState({ imageSource: imageURI })
                // alert(this.state.imageSource);
                await this._sendMessage(imageURI, type);
            } catch (error) {
                alert(error);
                return null;
            }
    }

    // goView(imageBase64){
    //     this.props.navigation.navigate("image", {image:imageBase64});
    // }


    _retrieveData = async (key) => {
        if (this._isMounted) {
            try {
                const value = await AsyncStorage.getItem(key);
                if (value !== null) {
                    // We have data!!
                    // console.log("Retrieving data...");
                    // console.log(data);
                    return value;
                }
            } catch (error) {
                alert(error);
                return null;
            }
        }
    }

    viewLocation = async () => {
        const p = await Permissions.check('location');
        if (p === 'authorized') {
            const pi = await Permissions.request('location');
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    opened: false,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                this._sendMessage("location", "location");

            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )

        // this._sendMessage("hi","location");

    }

    sendAudio = async () => {
        // alert("entered sendAudio");
        if (this.state.audioFile === '') {
            // alert("No Audio Message Recorded!");
        }
        else {
            this.setState({
                audioStop: false,
                visible: false,
            });
            RNFS.readFile(this.state.audioFile, 'base64').then((content) => {
                // alert(content);
                // this.setState=({
                // visible:false,
                // });
                // alert(content);
                this._sendMessage(content, "audio");
            });
        }
    }

    selectVideo = async () => {

        const options = {
            title: 'Select Video',
            mediaType: 'video',
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                RNFS.readFile(response.uri, 'base64').then((content) => {
                    // alert(content);
                    this._sendMessage(content, "video");
                });
                // var video = this._convertPathToBase64(response.uri);

                // return response.uri;
            }

            // return null;
        });
    }


    _convertPathToBase64 = (path) => {
        RNFS.readFile(path, 'base64').then((content) => {
            return content;
        });
    }

    _convertBase64ToMOV = (data) => {

        const path = RNFS.DocumentDirectoryPath + "/video.MOV";
        console.log(path);
        RNFS.writeFile(path, data, 'base64')
            .then(success => {
                // alert('FILE WRITTEN: ', "video");
                return path;
            })
            .catch(err => {
                alert('File Write Error: ', err.message);
                return null;
            });
    }

    

    _convertBase64ToWAV = (data) => {

        const path = RNFS.DocumentDirectoryPath + "/audio.WAV";
        console.log(path);
        RNFS.writeFile(path, data, 'base64')
            .then(success => {
                alert('FILE WRITTEN: ', "audio");
                return path;
            })
            .catch(err => {
                alert('File Write Error: ', err.message);
                return null;
            });
    }

    _retrieveMessages = () => {
        if (this._isMounted) {
            this._retrieveData("userData").then((userData) => {
                // alert(typeof(userData));
                

                userData = JSON.parse(userData);
                
                var chatId = this.props.navigation.state.params.chatId;
                try {
                    let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=" + userData.token + "&chatId=" + chatId, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    }).then((response) => {

                        messages = response._bodyText;
                        // alert(messages);
                        messages = JSON.parse(messages);
                        var check = 1;

                        for (i = 0; i < messages.messages.length; i++) {
                            messages.messages[i].user._id = messages.messages[i].user.user_email;
                            messages.messages[i].user.name = messages.messages[i].user.user_email;
                            messages.messages[i].user.avatar = 'data:image/jpeg;base64,' + messages.userData.image;
                            if (messages.messages[i].type === 1)
                                messages.messages[i].text = messages.messages[i].message;
                            else if (messages.messages[i].type === 3) {
                                messages.messages[i].image = 'data:image/jpeg;base64,' + messages.messages[i].media;
                            }
                            else if (messages.messages[i].type === 5) {
                                // alert(messages.messages[i].latitude);
                                // alert(messages.messages[i].longitude);

                                if (messages.messages[i].latitude == null || messages.messages[i].longitude == null) {
                                    messages.messages[i].type = 1;
                                    messages.messages[i].text = messages.messages[i].message
                                        ;
                                }

                                else {
                                    messages.messages[i].location = {
                                        latitude: messages.messages[i].latitude,
                                        longitude: messages.messages[i].longitude,
                                    }
                                }

                            }
                            else if (messages.messages[i].type === 4) {
                                // alert(messages.messages[i].media);
                                const path = RNFS.DocumentDirectoryPath + "/" + messages.messages[i]._id + ".MOV";
                                // console.log(path);
                                RNFS.writeFile(path, messages.messages[i].media, 'base64')
                                    .then(success => {

                                    })
                                    .catch(err => {
                                        alert('File Write Error: ' + err.message);
                                    });
                                // alert(typeof(path));
                                messages.messages[i].video = {
                                    path: path,
                                }
                            }

                            else if (messages.messages[i].type === 2) {
                                const path = RNFS.DocumentDirectoryPath + "/" + messages.messages[i]._id + ".WAV";
                                // console.log(path);
                                // alert(path);
                                RNFS.writeFile(path, messages.messages[i].media, 'base64')
                                    .then(success => {
                                        // alert("success: "+path);
                                    })
                                    .catch(err => {
                                        alert('File Write Error: ' + err.message);
                                    });
                                // alert(typeof(path));
                                messages.messages[i].audio = {
                                    path: path,
                                }
                            }

                            else if (messages.messages[i].type === 6) {
                                // alert
                                messages.messages[i].snap = 'data:image/jpeg;base64,' + messages.messages[i].media;
                                messages.messages[i].image = 'data:image/jpeg;base64,' + messages.messages[i].media;
                            }

                            messages.messages[i].createdAt = new Date(messages.messages[i].time);
                            // messages.messages[i].user.name = userData.name;
                        }
                        newMessageArray = this.state.messages;
                        for (i = this.state.messageLength; i < messages.messages.length; i++) {
                            newMessageArray = GiftedChat.append(newMessageArray, messages.messages[i])
                        }
                        if (this._isMounted)
                            this.setState(
                                {
                                    user_name: userData.email,
                                    isFetching: false,
                                    messages: messages.messages,
                                    messageLength: messages.messages.length,
                                });
                        // alert(JSON.stringify(this.state.messages[0]));
                        // alert(this.state.user_name)
                        // this._isMounted=true;

                    });

                } catch (exp) {
                    alert("nonononoo");
                    this.setState(
                        {
                            isFetching: false,
                            messages: []
                        });
                }

            });
        }
    }

    _sendMessage = async (message, messageType) => {
        // alert(messageType);
        //type: 1 for text, 2 for audio? 3 for image, 4 for video, 5 for location, 6 for snaps
        const user = { name: this.state.user_name, _id: this.state.user_email };
        // const user = {name: "harmin@hotmail.ca", _id: "harmin@hotmail.ca"};
        var new_message = {}; var type = 1;
        var media = "no media";
        if (messageType === "text") {
            new_message = message[0];
            message = message[0].text;
            if (message === "" || message === null)
                return;
        }
        else if (messageType === "video") {
            type = 4;
            media = message;
            message = "[video]";

        }

        else if (messageType === "snap") {
            type = 6;
            // alert("snap message sent");
            message = "[snap]";
            media = encodeURIComponent(this.state.imageSource);
            new_message.image = 'data:image/jpeg;base64,' + this.state.imageSource;
        }
        else if (messageType === "location") {
            type = 5;
            media = "no media";
            message = "[location]";
            new_message.location = {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            };
        }
        else if (messageType === "audio") {
            type = 2;
            // alert("audio sent");
            // new_message.audi
            media = message;
            message = "[audio]";
        }
        else if (messageType === "image") {
            // alert("image");
            type = 3;
            message = "[image]";
            media = encodeURIComponent(this.state.imageSource);
            new_message.image = 'data:image/jpeg;base64,' + this.state.imageSource;
            // alert(this.state.imageSource);
        }
        new_message.user = user;
        // alert(message);
        this._retrieveData("userData").then((userData) => {
            // alert(userData)
            userData = JSON.parse(userData);

            var chatId = this.props.navigation.state.params.chatId;
            var somethingRandom = JSON.stringify({
                token: userData.token,
                chatId: chatId,
                message: message,
                type: type,
                email: userData.email,
                media: media,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            })
            try {
                let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/", {
                    // let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token="+userData.token+"&chatId=" + chatId + "&message=" + message + "&type="+type+"&email=" + userData.email+"&media="+media+"&latitude="+this.state.latitude+"&longitude="+this.state.longitude, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: somethingRandom,
                })
            } catch (exp) {
                alert(exp);
                this.setState(
                    {
                        isFetching: false,
                        messages: []
                    });
                // this.render();
            }
        });

    }

    componentDidMount() {
        try {
            this.token = this.props.navigation.state.params.token;

            this._isMounted = true;
            // var userData = '';
            // this._retrieveData("userData").then((userData) => {
            //     userData = JSON.parse(userData);
            //     this.setState({
            //         // chatId: this.props.navigation.state.params.chatId,
            //         // token: userData.token,
            //     })
            // });
            
            this._retrieveMessages();

            this._interval = setInterval(() => {
                if (this._isMounted) {
                    this._retrieveMessages();
                    // this._isMounted = false;

                    // alert("time out");
                }
            }, 1000);
        } catch (error) {
            alert(error);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._interval);
    }
    //audio record setup 
    record = async () => {
        await this.checkPermission();
        const options = {
            sampleRate: 16000,
            channels: 1,
            bitsPerSample: 16,
            wavFile: 'test.wav'
        };

        AudioRecord.init(options);

        AudioRecord.on('data', data => {
            const chunk = Buffer.from(data, 'base64');
            // do something with audio chunk
        });
        this.setState({ visible: true, opened: false })
    }

    checkPermission = async () => {
        const p = await Permissions.check('microphone');
        console.log('permission check', p);
        if (p === 'authorized') return;
        this.requestPermission();
    };

    requestPermission = async () => {
        const p = await Permissions.request('microphone');
        console.log('permission request', p);
    };
    //start recording 
    start = () => {
        console.log('start record');
        this.setState({ audioFile: '', recording: true, loaded: false });
        AudioRecord.start();
    };
    //stop recording 
    stop = async () => {
        if (!this.state.recording) return;
        console.log('stop record');
        let audioFile = await AudioRecord.stop();
        console.log('audioFile', audioFile);
        this.setState({ audioFile, recording: false, audioStop: true });
    };

    load = () => {
        return new Promise((resolve, reject) => {
            if (!this.state.audioFile) {
                return reject('file path is empty');
            }

            this.sound = new Sound(this.state.audioFile, '', error => {
                if (error) {
                    console.log('failed to load the file', error);
                    return reject(error);
                }
                this.setState({ loaded: true });
                return resolve();
            });
        });
    };
    //play audio 
    play = async () => {
        if (!this.state.loaded) {
            try {
                await this.load();
            } catch (error) {
                console.log(error);
            }
        }

        this.setState({ paused: false });
        Sound.setCategory('Playback');

        this.sound.play(success => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
            this.setState({ paused: true });
            this.sound.release();
        });
    };

    pause = () => {
        this.sound.pause();
        this.setState({ paused: true });
    };

    //Choose picture 
    selectPhotoTapped(type) {
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

                this.returnData(response.data, type);
                this.onBackdropPress();
            }
        });
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