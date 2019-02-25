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

class Contact extends React.Component {
    static navigationOptions  = {
        //tabBarVisible = false,
       header : null
    };

    constructor(props) {

        super(props);
        this._retrieveData = this._retrieveData.bind(this);
      //  var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
         chats:[],
         isFetching : false,
       //  dataSource: ds,
     };  
    }

    componentDidMount() {
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            this.setState({
            userData:userData,
        })
        this.refresh();
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
                <Text style={styles.toolbarTitle}>Contacts</Text>
                <Text style={styles.toolbarButton}></Text>
            </View>             
        </View>);}
        else{
            var data = this.state.chats;
           // alert(data);
            var getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
            var getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
            var ds = new ListView.DataSource({
              rowHasChanged: (r1, r2) => r1 !== r2,
              sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
              getSectionData,
              getRowData,
            }); 
            var { dataBlob, sectionIds, rowIds } = this.formatData(data);
        console.log("rendering...");

        return (
            <View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Ionicons style={{color:'#fff',marginLeft:10,width:50}} name='md-add' size={28} onPress = {()=>this.gotoAdd(navigate)}/>
                    <Text style={styles.toolbarTitle}>Contacts</Text>
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
                  //data = {this.state.chats}
                  dataSource = {ds.cloneWithRows(data)}
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
            // this.state.userData.token = "Token1"; //CHANGE THIS
            try
            {let req = fetch("http://40.118.225.183:8000/Contact/Contacts/?token="+this.state.userData.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                // alert(response);
                chatlist = response._bodyText;
                alert(chatlist);
                chatlist = JSON.parse(chatlist);
                 alert(JSON.stringify(chatlist));

                this.setState(
                    {
                        isFetching: false,
                        chats: chatlist.contact,
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
        // this._interval = setInterval(() => {
                
        //             this.refresh();
        //         }, 1000);
    });
    }

    // componentWillUnmount() {
    //     clearInterval(this._interval);
    // }

    _renderRow(chats,navigate) {
        return (
          <TouchableOpacity onPress = {
            ()=>this.gotoProfile(chats,navigate)
          }>
            <Row {...chats}/>
            {/* <Text >{chats.name}</Text>
            <Text >{chats.message}</Text> */}
          </TouchableOpacity>
        );
      }

      gotoAdd(navigate){
        navigate("AddFriends",{onGoBack: ()=>this.comeBack()});
        // clearInterval(this._interval);
      }

      gotoProfile(chats,navigate){
        navigate("Profile",{email:chats.email,name: chats.name,});
        // clearInterval(this._interval);
      }


      formatData(data) {
        // We're sorting by alphabetically so we need the alphabet
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
        // Need somewhere to store our data
        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];
    
        // Each section is going to represent a letter in the alphabet so we loop over the alphabet
        for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
          // Get the character we're currently looking for
          const currentChar = alphabet[sectionId];
    
          // Get users whose first name starts with the current letter
          const users = data.filter((user) => user.name.toUpperCase().indexOf(currentChar) === 0);
    
          // If there are any users who have a first name starting with the current letter then we'll
          // add a new section otherwise we just skip over it
          if (users.length > 0) {
            // Add a section id to our array so the listview knows that we've got a new section
            sectionIds.push(sectionId);
    
            // Store any data we would want to display in the section header. In our case we want to show
            // the current character
            dataBlob[sectionId] = { character: currentChar };
    
            // Setup a new array that we can store the row ids for this section
            rowIds.push([]);
    
            // Loop over the valid users for this section
            for (let i = 0; i < users.length; i++) {
              // Create a unique row id for the data blob that the listview can use for reference
              const rowId = `${sectionId}:${i}`;
    
              // Push the row id to the row ids array. This is what listview will reference to pull
              // data from our data blob
              rowIds[rowIds.length - 1].push(rowId);
    
              // Store the data we care about for this row
              dataBlob[rowId] = users[i];
            }
          }
        }
    
        return { dataBlob, sectionIds, rowIds };
      }
}



export default Contact;