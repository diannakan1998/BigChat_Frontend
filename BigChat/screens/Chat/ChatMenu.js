        import React from 'react';
        import { View, ListView,StyleSheet, Text, Image,TouchableOpacity} from 'react-native';
        import ImagePicker from 'react-native-image-picker';
        import Video from 'react-native-video';
        import Button from 'apsl-react-native-button';

        const styles = StyleSheet.create({
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
            textStyle6: {
                color: '#8e44ad',
                fontFamily: 'Avenir',
                fontWeight: 'bold'
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
                backgroundColor: '#2ecc71'
            },
            buttonStyle5: {
                borderColor: '#2980b9',
                backgroundColor: '#3498db'
            },
            buttonStyle6: {
                borderColor: '#8e44ad',
                backgroundColor: '#9b59b6'
            },
            buttonStyle7: {
                borderColor: '#8e44ad',
                backgroundColor: 'white',
                borderRadius: 0,
                borderWidth: 3,
            },
            buttonStyle8: {
                backgroundColor: 'white',
                borderColor: '#333',
                borderWidth: 2,
                borderRadius: 22,
            },
            toolbar: {
                backgroundColor: '#00bfff',
                paddingTop: 30,
                paddingBottom: 10,
                flexDirection: 'row'    //Step 1
            },
            toolbarTitle: {
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                flex: 1
            },
        });

        export default class ChatMenu extends React.Component {
            static navigationOptions  = {
                header : null
             };
            constructor(props) {
                super(props);
                this.state = {
                    avatarSource: null,
                    videoSource: null,
                    isOnPressing: false,
                };
            }

            render() {
                return(
                    <View style = {{flex: 1}}>
                        <View style={styles.toolbar}>
                            <Text style={styles.toolbarTitle}>Chats</Text>
                        </View>
                    <View style={styles.container}>
                        <Button
                            textStyle={styles.textStyle} style={styles.buttonStyle1}
                            onPress={this.selectPhotoTapped.bind(this)}>
                            Select Image
                            </Button>
                        <Button
                            style={styles.buttonStyle2} textStyle={styles.textStyle}
                            onPress={this.selectPhotoTapped.bind(this)}>
                            Send Image
                        </Button>
                        <Button
                            style={styles.buttonStyle3} textStyle={styles.textStyle}
                            onPress={this.selectVideoTapped.bind(this)}>
                            Select Video 
                        </Button>
                        <Button
                            style={styles.buttonStyle4} textStyle={styles.textStyle}
                            onPress={this.selectVideoTapped.bind(this)}>
                            Send Video
                        </Button>
                        <Button
                            style={styles.buttonStyle5} textStyle={styles.textStyle}
                            onPress={() => {
                            this.props.navigation.navigate("VoiceRecord",{})}}>
                            Audio Recording 
                        </Button>
                        <Button
                            style={styles.buttonStyle6} textStyle={styles.textStyle}>
                            Location Sharing 
                        </Button>
                        <Button
                            style={styles.buttonStyle7} textStyle={styles.textStyle6}
                            onPress={() => {
                            console.log('world!')
                            }}>
                            SnapChat
                        </Button>
                        <Button
                            style={styles.buttonStyle7} textStyle={styles.textStyle6}
                            onPress={() => {
                            this.props.navigation.goBack();
                            }}>
                            Cancel
                        </Button>
                    </View>
                </View>

                );
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
                        // alert(typeof(response.data));
                        
                        this.props.navigation.state.params.returnData(response.data);
                        this.props.navigation.goBack();
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

        }4