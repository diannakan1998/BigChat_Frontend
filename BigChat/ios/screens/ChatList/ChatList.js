import React from 'react';
import { View, ListView, StyleSheet,RefreshControl,TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import Row from './Row';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import chats from './data';


const styles = StyleSheet.create({
    message: {
        color: 'blue',
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 18,
        alignItems: 'center',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    toolbar: {
        backgroundColor: '#00bfff',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarButton: {
        width: 50,
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1
    }
});

class ChatList extends React.Component {
    static navigationOptions  = {
        //tabBarVisible = false,
       header : null
    };

    constructor(props) {

        super(props);
        this._retrieveData = this._retrieveData.bind(this);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
         chats:[],
         isFetching : false,
         dataSource: ds,
     };  
    }

    componentDidMount() {
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            this.setState({
            userData:userData,
        })
        this.refresh();
        this._interval = setInterval(() => {
                
                    this.refresh();
                }, 1000);
    });

    }



    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                // alert("Retrieving data...");
                // alert(value);
                return value;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    

    render() {
        var {navigate} = this.props.navigation;
        if(this.state.isFetching === true){
        return(<View style={{ flex: 1 }} >
            <View style={styles.toolbar}>
                <Ionicons style={{color:'#fff',marginLeft:10,width:50}} name='md-add' size={28} onPress = {()=>this.gotoAdd(navigate)}/>                
                <Text style={styles.toolbarTitle}>All Chats</Text>
                <Text style={styles.toolbarButton}></Text>
            </View>             
        </View>);}
        else{

        console.log("rendering...");

        return (
            <View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Ionicons style={{color:'#fff',marginLeft:10,width:50}} name='md-add' size={28} onPress = {()=>this.gotoAdd(navigate)}/>
                    <Text style={styles.toolbarTitle}>All Chats</Text>
                    <Text style={styles.toolbarButton}></Text>
                </View>
                <ListView
                enableEmptySections={true}
                   dataSource={this.state.dataSource}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}
                      onRefresh={this.refresh}
                    />
                  }
                  data = {this.state.chats}
                  dataSource = {this.state.dataSource.cloneWithRows(this.state.chats)}
                  renderRow={(data)=> this._renderRow(data,navigate)}
                    //renderRow={(data) => <Row {...data} />}
                 renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
            </View>
        );}
    }
    refresh=()=>{
        this.setState({
            isFetching:false,
        })

        
            // alert(userData);
            
            // alert(userData);
            this.state.userData.token = "Token1"; //CHANGE THIS
            try
            {let req = fetch("http://40.118.225.183:8000/chat/chatlist/?token="+this.state.userData.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                // alert(response);
                chatlist = response._bodyText;
                chatlist = JSON.parse(chatlist);
                // alert(JSON.stringify(chatlist));

                this.setState(
                    {
                        isFetching: false,
                        chats: chatlist.chats,
                        //dataSource : ds.cloneWithRows(chats),
                    });
            });
                }catch (exp) {

                        this.setState(
                            {
                                isFetching: false,
                                chats: null
                            });
                        alert(exp);

                        this.render();

                    }

    }
    comeBack(){
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            this.setState({
            userData:userData,
        })
        this.refresh();
        this._interval = setInterval(() => {
                
                    this.refresh();
                }, 1000);
    });
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    _renderRow(chats,navigate) {
        return (
          <TouchableOpacity onPress = {
            ()=>this.gotochat(chats,navigate)
          }>
            <Row {...chats}/>
            {/* <Text >{chats.name}</Text>
            <Text >{chats.message}</Text> */}
          </TouchableOpacity>
        );
      }

      gotoAdd(navigate){
        navigate("AddFriends",{onGoBack: ()=>this.comeBack()});
        clearInterval(this._interval);
      }

      gotochat(chats,navigate){
        navigate("Chat",{chatId:chats.chatId,name: chats.name,chatList_interval:this._interval, onGoBack: ()=>this.comeBack()});
        clearInterval(this._interval);
      }
}



export default ChatList;