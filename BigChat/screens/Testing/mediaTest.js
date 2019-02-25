import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, AsyncStorage, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import video from './Test.mp4';
var RNFS = require('react-native-fs');

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Video',
    mediaType: 'video',
};

class mediaTest extends Component {
    state = {
        gotImage: false,
        image: null,
        avatarSource: null,
    }

    _sendImage = () => {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: 'content://' + response.path };

                // const source = response.path;
                // You can also display the image using data:
                // const source = { uri: 'data:image/png;base64,' + response.uri };

                console.log("Here");
                // alert("2.0");
                // alert(response.uri);
                console.log(source);
                var file = null;
                console.log("Here 2.0:");
                
                RNFS.readFile( response.uri, 'base64').then((content) => {
                    // alert(content);
                    alert(content.length);

                    // const path = 'file:///storage/emulated/0/Android/data/com.bigchat/files/Test.mp4';
                    const path = RNFS.DocumentDirectoryPath + "/Test.MOV";
                    console.log(path);
                    RNFS.writeFile(path, content, 'base64')
                    .then(success => {
                        alert('FILE WRITTEN: ', "test");
                        this.setState({
                            avatarSource: source,
                            image: source,
                            gotImage: true
                        });
                    })
                    .catch(err => {
                        alert('File Write Error: ', err.message);
                    })


                });

                // var b64Response = btoa(response.uri);
                // console.log(b64Response);
                // console.log(length(b64Response));

                // this.setState({
                //     avatarSource: source,
                //     image: source,
                //     gotImage: true
                // });


                // try {

                //     var formdata = new FormData();
                //     formdata.append("user_id", 77);
                //     formdata.append("media", {
                //         uri: this.state.avatarSource,
                //         name: 'testPhotoName'
                //     });
                //     console.log("added to form...");

                //     var req = fetch("http://40.118.225.183:8000/media/mediaMessage/", {
                //         method: 'post',
                //         headers: {
                //             'Content-Type': 'multipart/form-data',
                //         },
                //         body: formdata
                //     }).then((response) => {

                //         alert(response._bodyText);

                //     });

                // } catch (error) {
                //     console.log(error);
                //     alert("Send image error")
                // }

            }
        });
    }


    _getImage = () => {



        try {


            formdata.append
            var req = fetch("http://40.118.225.183:8000/media/mediaMessage?user_id=77", {
                method: 'get',
            }).then((response) => {

                console.log(response);
                var rawImage = response._bodyText;
                var b64Response = btoa(rawImage);
                this.state.image = 'data:image/jpeg;base64,' + b64Response;
                this.state.gotImage = true;

                this.render();
            });

        } catch (error) {
            console.log(error);

            alert("send image error")
        }
    }

    onBuffer= () => {
        console.log("Buffering...");
    }

    videoError= (meta) => {
        console.log("Something went wrong...");
        console.log(meta);
    }

    renderVideo = () => {

        this.setState({
            gotImage: true
        });
        console.log("Changin....");
        this.render();

    }

    render() {
        if (!this.state.gotImage) {
            return (
                <View>
                    <Button title="Send" onPress={this._sendImage} />
                    {/* <Button title="Get" onPress={this._getImage} /> */}
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Video 
                    source={{uri: RNFS.DocumentDirectoryPath + "/Test.MOV"}}
                    // source={{uri: "https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/1455/8/207277102/706899303.mp4?token=1543114406-0xc3ec7557131180d473c1560bff5f37fb97dfb78f"}}
                    resizeMode="cover"
                    style={StyleSheet.absoluteFill}
                    />
                </View>
            )
        }
    }
}

// Later on in your styles..
var styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default mediaTest;