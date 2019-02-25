import PropTypes from 'prop-types';
import React from 'react';
import {
  AsyncStorage,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,View,Image,Text,
  ViewPropTypes,Slider, TouchableWithoutFeedback,Dimensions,Button
} from 'react-native';
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';

export default class CustomView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        audioWidth:15,
        audioHeight: 25,
      videoWidth: 150,
      videoHeight: 250, // 默认16：9的宽高比
      isPlaying: false,        // 视频是否正在播放
      playFromBeginning: false, // 是否从头开始播放
      audioFile: '',
    recording: false,
    loaded: false,
    paused: true
    };
}
  render() {
    // const { navigate } = this.props.navigation;
    
    if (this.props.props.currentMessage.location) {
      return (
        <TouchableOpacity style={this.props.props.containerStyle} onPress={() => {
          const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${this.props.props.currentMessage.location.latitude},${this.props.props.currentMessage.location.longitude}`,
            ios: `http://maps.google.com/?q=${this.props.props.currentMessage.location.latitude},${this.props.props.currentMessage.location.longitude}`
          });
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              return Linking.openURL(url);
            }
          }).catch(err => {
            console.error('An error occurred', err);
          });
        }}>
         <MapView
       //   provider = {PROVIDER_GOOGLE}
            style={[styles.mapView, this.props.props.mapViewStyle]}
            region={{
              latitude: this.props.props.currentMessage.location.latitude,
              longitude: this.props.props.currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
          {/* <MapView.Marker 
            coordinate = {{latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude}}/> */}
          
        </TouchableOpacity>
      );
    }

    else if(this.props.props.currentMessage.video){
      return(
<View style={styles.container} >
<View style={{width:this.state.videoWidth,height:this.state.videoHeight}}>
  <Video
    ref={(ref) => this.videoPlayer = ref}
    source={{uri: this.props.props.currentMessage.video.path}}
    rate={1.0}
    volume={1.0}
    muted={false}
    paused={!this.state.isPlaying}
    resizeMode={'contain'}
    playWhenInactive={false}
    playInBackground={false}
    ignoreSilentSwitch={'ignore'}
    progressUpdateInterval={250.0}
    onLoadStart={this._onLoadStart}
    onLoad={this._onLoaded}
    onProgress={this._onProgressChanged}
    onEnd={this._onPlayEnd}
    onError={this._onPlayError}
    onBuffer={this._onBuffering}
    style={{width:this.state.videoWidth,height:this.state.videoHeight}}
  />
  <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.state.videoWidth,
        height: this.state.videoHeight,
        backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
        alignItems:'center',
        justifyContent:'center'
      }}>
       <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
          {this.state.isPlaying? <Ionicons name='ios-pause' size={35} style={{color:'#fff', marginLeft:5}}/>:
          <Ionicons name='ios-play' size={35} style={{color:'#fff', marginLeft:5}}/>}
        </TouchableOpacity>
    </View>
  </TouchableWithoutFeedback> 
  </View>
</View>
      );
    }
    else if(this.props.props.currentMessage.snap){
        // alert("snap");
        return(
          <View style={styles.container} >
            <Text onPress={()=>this.ViewSnap(this.props.props.currentMessage.snap)}>A new Snap! Click to delete it!</Text>
          </View>
        );
      }
    else if(this.props.props.currentMessage.audio){
        return(
        <View style={styles.audio}>
            <View style={{width: 50,height: 30,}}>
            {this.state.paused ? (
                <Ionicons onPress={this.play} name='ios-play' size={25} style={{color:'#fff', marginLeft:10}}/>
            ) : (
                <Ionicons onPress={this.pause} name='ios-pause' size={25} style={{color:'#fff', marginLeft:10}} />
            )}
            </View>
            <Video
                ref={ref => (this.player = ref)}
                source={{ uri: this.props.props.currentMessage.audio.path }}
                paused={this.state.paused}
                volume={5.0}
                ignoreSilentSwitch={'ignore'}
                onLoad={this.onLoad}
                onProgress={this.onProgress}
                onEnd={this.onEnd}
                onError={this.onError}
            />
        </View>
        );
      }
    return null;
  }
  
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

  ViewSnap = (image)=>{
    
        // alert(this.props.props.currentMessage.token);
        // alert(this.props.props.currentMessage._id);
    //   var chatId = this.props.props.navigation.state.params.chatId;
      try {
          let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?"+ "&token="+this.props.props.currentMessage.token +"&_id="+this.props.props.currentMessage._id, {
              method: "PUT",
              headers: {
                  Accept: 'application/json',
              },
          })
        // alert(image);
        
        this.props.props.currentMessage.image = image;
        // this.props.props.navigation
        // this.props.props.currentMessage.type = 2;
        
        

      } catch (exp) {
          alert(exp);
          this.setState(
              {
                  isFetching: false,
                  messages: []
              });
      }
    //   this.props.go(image);
    //   this.props.props.
  }

  play = async() => {
    const p = await Permissions.check('microphone');
    if (p === 'authorized'){
        const pi = await Permissions.request('microphone');
    }
    if (!this.state.loaded) this.player.seek(0);
    this.setState({ paused: false, loaded: true });
  };

  pause = () => {
    this.setState({ paused: true });
  };

  onLoad = data => {
    console.log('onLoad', data);
  };

  onProgress = data => {
    console.log('progress', data);
  };

  onEnd = () => {
    console.log('finished playback');
    this.setState({ paused: true, loaded: false });
  };

  onError = error => {
    console.log('error', error);
  };
   /// -------Video组件回调事件-------
  
   _onLoadStart = () => {
    console.log('视频开始加载');
  };
  
  _onBuffering = () => {
    console.log('视频缓冲中...')
  };
  
  _onLoaded = (data) => {
    console.log('视频加载完成');
    this.setState({
      duration: data.duration,
    });
  };
  
  _onProgressChanged = (data) => {
    console.log('视频进度更新');
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
      })
    }
  };
  
  _onPlayEnd = () => {
    console.log('视频播放结束');
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true
    });
  };
  
  _onPlayError = () => {
    console.log('视频播放失败');
  };
  
  ///-------控件点击事件-------
  
  /// 控制播放器工具栏的显示和隐藏
  hideControl() {
    if (this.state.showVideoControl) {
      this.setState({
        showVideoControl: false,
      })
    } else {
      this.setState(
        {
          showVideoControl: true,
        },
        // 5秒后自动隐藏工具栏
        () => {
          setTimeout(
            () => {
              this.setState({
                showVideoControl: false
              })
            }, 5000
          )
        }
      )
    }
  }
  
  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlay,
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      })
    }
  }
  
  /// 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }

  /// 进度条值改变
  onSliderValueChanged(currentTime) {
    this.videoPlayer.seek(currentTime);
    if (this.state.isPlaying) {
      this.setState({
        currentTime: currentTime
      })
    } else {
      this.setState({
        currentTime: currentTime,
        isPlaying: true,
      })
    }
  }

}

const styles = StyleSheet.create({
  container: {
  },
  audio: {
    flex: 1,
    justifyContent: 'center'
  },
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0'
//   },
  playButton: {
    width: 50,
    height: 50,
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  time: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    marginRight: 10
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  videoView:{
    width: 150,
    height:250,
    borderRadius: 13,
    margin: 3,
  }
});

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
};

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
};