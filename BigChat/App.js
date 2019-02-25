/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 
import React, {Component} from 'react';
import {AppRegistry,Platform, StyleSheet, Text, View} from 'react-native';
import Login from './screens/Login/Login.js';
import ChatList from './screens/ChatList/ChatList.js';
import Contact from './screens/Contact/Contact.js';
import Chat from './screens/Chat/Chat';
import Profile from './screens/Profile/Profile';
import MyProfile from './screens/Profile/MyProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import ChatMenu from './screens/Chat/ChatMenu'
import VoiceRecord from './screens/Chat/VoiceRecord'
import AddFriends from './screens/AddFriends/AddFriends'

// export default class DemoLogin extends Component {
//   render() {
//     return (
//       <Login />
//     );
//   }
// }

export default class App extends React.Component {
  render() {
    return <AuthStack />;
  }
}
// const AppStack = createStackNavigator(
//   { Home: ChatList, 
//     Contact: Contact, 
//     Logout: Login ,Bottom:BottomNavBar,},  
//   {
//      // Hides Header globally
//      navigationOptions: {
//       header: null,
//      }
//   }
//  );

 const ChatNav = createStackNavigator({
  ChatList:ChatList,
  AddFriends:AddFriends,
  Chat:{screen:Chat},
  ChatMenu:ChatMenu,
  Profile:Profile,
  VoiceRecord:VoiceRecord,
});

ChatNav.navigationOptions=({navigation})=>{
  if(navigation.state.index !== 0){
    return{
      tabBarVisible : false,
    };
  }
  return{
    tabBarVisible : true,
  };
}

const ContactNav = createStackNavigator({
  Contacts:Contact,
  Profile:Profile,
  Chat:Chat,
});

const BottomNavBar = createBottomTabNavigator(
  {
    Chats: {
      screen: ChatNav,
      navigationOptions: {
        tabBarLabel: 'Chats',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name='ios-chatbubbles'
            size={25}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Contacts: {
      screen: ContactNav,
      navigationOptions: {
        tabBarLabel: 'Contacts',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name = 'md-people'
            size={25}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  Me: {
    screen: MyProfile,
    navigationOptions: {
      tabBarLabel: 'Me',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name='md-person'
          size={25}
          style={{ color: tintColor }}
        />
      ),
    },
  },
},
  {
    tabBarOptions: {
      showLabel: true,
      showIcon: true,
    },
  }
);

const AuthStack = createSwitchNavigator(
  {
    Login: Login,
    App: BottomNavBar,
    
  },
  {
    // Hides Header globally
    navigationOptions: {
      header: null,
    }
   },
  {
    initialRouteName: 'Login',
  }
);

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Login,
      navigationOptions: {
        header: null // Will hide header for Home only
    }
    },
    Contact: Contact,
    ChatList: ChatList,
    Login: Login,
  },
  {
    // Hides Header globally
    navigationOptions: {
      header: null,
    }
   },
  {
    initialRouteName: 'Home',
  },
);


AppRegistry.registerComponent('DemoLogin', () => DemoLogin);
