import React, {Component} from 'react';
import { View, ListView, StyleSheet, Text,Image, AsyncStorage,TextInput, Button, FlatList, TouchableOpacity, SectionList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class AddFriends extends React.Component {
    static navigationOptions ={
        header: null,
    };

    state = {
        isFetching: true,
        friendRequests: [],
        friendSent: [],
        emailToAdd: "",
        emailToRemove: ""
    }

    _addEmail = async(email) => {
        // TODO: Implement this...

        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);
            // userData.token = "Token1";
            // userData.email="harminder@hotmail.ca"
            if (email === userData.email) {
                alert("You can't add yourself...");
                return;
            }

            try {
             console.log("adding... " + email);

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to send add friend request.");
        }
        });

    }

    _retrieveData = async (key) => {
        // alert("retrieving user data")
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                // alert(value);
                return value;
            }
        } catch (error) {
            alert(error);
            return null;
        }
    }


    componentDidMount() {
        this._retrieveRequests();
       
    }

    // componentWillUnmount() {
    //     clearInterval(this._interval);
    // }

    _retrieveRequests = () => {

        // alert("Retrieving data...");
        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);
            // userData.token = "Token1";
            try {

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=" + userData.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                // alert("In here...");
                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

                this.setState(
                    {
                        isFetching: false,
                        friendRequests: friendRequests.recieved,
                        friendSent: friendRequests.sent
                    });
                    this.render();
                    // alert(friendRequests);
            });

        } catch (exp) {

            this.setState(
                {
                    isFetching: false,
                    friendRequests: [],
                    friendSent: []
                });

        }
        });
    }

    _accept = async(email) => {

        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);
            // userData.token = "Token1";
            // userData.email="harminder@hotmail.ca"

            if (email === userData.email) {
                alert("You can't add yourself...");
                return;
            }

            try {

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to add friend.");
        }
        });

    }

    _decline = async(email) => {
        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);
            // userData.token = "Token1";
            // userData.email="harminder@hotmail.ca"
            try {
            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to decline friend.");
        }
        });

    }

    backAndRefresh(){
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

     renderRequests = ({ item, index, section: { title, data } }) => {
        return (
            <View style={styles.flatview}>
            <View style={styles.email}>
                <Text style={styles.textSize}>{item}</Text>
            </View>
            <View style={styles.optionButtons}>
                <TouchableOpacity 
                    style={styles.buttonPadding} 
                    onPress= {() => {
                        this._accept(item);
                    }} 
                ><Text style={styles.textSize}>Yes</Text></TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonPadding} 
                    onPress= {() => {
                        this._decline(item);
                    }} 
                    ><Text style={styles.textSize}>No</Text></TouchableOpacity> 
            </View>   
        </View>
        );
     };

    render() {

         if (this.state.isFetching) {
            return (

                <View style = {{flex: 1}} >
                    <View style={styles.toolbar}>
                    <Ionicons
                    name='ios-arrow-back'
                    size={25}
                    style={{color:'#fff', marginLeft:5}}/>
                            <Text style = {styles.toolbarButton} onPress={()=>this.backAndRefresh()}>Back</Text>
                            <Text style={styles.toolbarTitle}>Add Friends</Text>
                            <Text style={styles.toolbarButton}></Text>
                    </View>

                    <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInput = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToAdd) => {
                                    this.setState({emailToAdd})
                            }}
                        />
                        
                        <Button 
                            title="Add"
                            onPress= {() => {
                                this._addEmail(this.state.emailToAdd);
                                this.textInput.clear();
                            }} 
                        />

                    </View>

                    <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInputRemove = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToRemove) => {
                                    this.setState({emailToRemove})
                            }}
                        />
                        
                        <Button 
                            title="Remove"
                            onPress= {() => {
                                this._decline(this.state.emailToRemove);
                                this.textInputRemove.clear();
                            }} 
                        />

                    </View>

                </View>

            );
         } else {

             return (
             <View style = {{flex: 1}} >
                 <View style={styles.toolbar}>
                 <Ionicons
                    name='ios-arrow-back'
                    size={25}
                    style={{color:'#fff', marginLeft:5}}/>
                    <Text onPress = {
                       ()=> this.backAndRefresh()
                    }
                    style={styles.toolbarButton} >Back</Text>
                        <Text style={styles.toolbarTitle}>Add Friends</Text>
                        <Text style={styles.toolbarButton}></Text>

                 </View>

                 <View style={styles.addFriendsBar}>
                    <TextInput
                        style={styles.input}
                        ref={input => { this.textInput = input }}
                        placeholder="Enter Email"
                        onChangeText={(email) => {
                                this.setState({email})
                        }}
                    />
                    
                    <Button 
                        title="Add"
                        onPress= {() => {
                            this._addEmail(this.state.email);
                            this.textInput.clear();
                        }} 
                    />
                 </View>

                 <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInputRemove = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToRemove) => {
                                    this.setState({emailToRemove})
                            }}
                        />
                        
                        <Button 
                            title="Remove"
                            onPress= {() => {
                                this._decline(this.state.emailToRemove);
                                this.textInputRemove.clear();
                            }} 
                        />

                    </View>

                <SectionList
                  onRefresh={() => {
                            this._retrieveRequests();
                  }}
                  refreshing={this.state.isFetching}               
                  renderItem={({item, index, section}) => 
                    <View style={styles.flatview}>
                        <View style={styles.email}>
                            <Text style={styles.textSize}>{item}</Text>
                        </View>
                        <View style={styles.optionButtons}>
                            <View style={styles.email}>
                                <Text style={styles.textSize}>Pending</Text>
                            </View>
                        </View>   
                    </View>
                  }
                  renderSectionHeader={({section: {title}}) => (
                    <Text style={{fontWeight: 'bold'}}>{title}</Text>
                  )}
                //   renderSectionFooter = {({section: {title}}) => (
                //     <Text>End Of Section</Text>
                //   )}
                  sections={[
                    {title: 'Requests', data: this.state.friendRequests, renderItem: this.renderRequests},
                    {title: 'Pending', data: this.state.friendSent}
                  ]}
                  keyExtractor={(item, index) => item + index}
                />

             </View>
             );
         }
    }
}

const styles = StyleSheet.create({
  buttonPadding: {
    marginRight: 15,
  },
  textSize: {
    fontSize: 17
  },
  optionButtons: {
    width: 100,
    justifyContent: "flex-end",
    paddingRight: 10,
    // backgroundColor: 'blue',
    borderRadius: 2,
    flexDirection:'row'
  },
  email: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    // backgroundColor: 'purple',
    borderRadius: 2,
    flexDirection:'row'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  toolbar:{
    backgroundColor:'#00bfff',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'    //Step 1
},
addFriendsBar:{
    flexDirection:'row'    
},
input: {
    // height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 25,
    flex:1
},
flatview: {
    // justifyContent: 'center',
    paddingTop: 15,
    paddingLeft: 15,
    height: 50,
    borderRadius: 2,
    flexDirection:'row' 
},
toolbarButton:{
    width: 47.5,            //Step 2
    color:'#fff',
    textAlign:'center',
    fontSize: 17,
},
});

export default AddFriends;