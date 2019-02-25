import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Permissions from 'react-native-permissions';
import {
    View,
    Text,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
      },
      toolbar:{
        backgroundColor:'#00bfff',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
  toolbarButton:{
      width: 50,            //Step 2
      color:'#fff',
      textAlign:'center',
      fontSize: 17,
  },
  toolbarTitle:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize: 25,
      flex:1                //Step 3
  },
});

export default class Location extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longitude: 0,
            latitude: 0,
        }
    }

    render(){
        if(this.state.longitude !== 0){
            return(<View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                    <Text style={styles.toolbarButton}>Back</Text>
                    <Text style={styles.toolbarTitle} onPress = {()=>this.getLocation}>Location</Text>
                    <Text onPress = {()=>this.getLocation} style={styles.toolbarButton} ></Text>
                </View>
            </View>);
        }
        return(
            <View style = {{flex: 1}}>
                <View style={styles.toolbar}>
                <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                    <Text style={styles.toolbarButton}>Back</Text>
                    <Text style={styles.toolbarTitle} onPress = {()=>this.getLocation}>Location</Text>
                    <Text onPress = {()=>this.getLocation} style={styles.toolbarButton} ></Text>
                </View>
                <MapView
                    style={styles.mapView}
                    region={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                />
          </View>);
        }

    getLocation= async()=>{
        const pi = await Permissions.check('location');
        if (pi !== 'authorized'){
            const p = await Permissions.request('location');
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
              });
            },
            (error) => alert(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
          );
        }
    }