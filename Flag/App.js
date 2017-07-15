import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  DatePickerIOS,
  PickerIOS,
  PickerItemIOS
} from 'react-native';
import { StackNavigator } from 'react-navigation';
// import {
//   Form,
//   Switch,
//   DatePickerIOS,
//   Picker,
//   PickerIOS,
//   Slider
// }from 'react-native-form'



//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  }
  constructor(props) {
    super (props);
    this.state = {
      token: ''
    }
  }

login  = async() => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('130655217532814', {
        permissions: ['user_friends', 'public_profile' ],
      });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
  //     const response = await fetch(
  //     `https://graph.facebook.com/me?access_token=${token}`);
  //   Alert.alert(
  //     'Logged in!',
  //     `Hi ${(await response.json()).name}!`,
  //   );
  //   }
  // }
    fetch('https://newflagapp.herokuapp.com/api/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: `${token}`
    })
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (json.success){
        this.setState({
          token:`${token}`
        });
        console.log(this.state.token)
        this.props.navigation.navigate('Register', {token: this.state.token});
      }
    })
    .catch((err) => {
      alert('error ' + err)
    });
  }
}




  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>FLAG</Text>
        <TouchableOpacity style={[styles.button, styles.loginBtnFacebook]} onPress={() => {this.login()} }>
         <Text style={styles.buttonLabel}>Login with Facebook</Text>
       </TouchableOpacity>
      </View>
    )
  }
}


class FeedScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Nearby',
    headerRight: <Button title='Log Out' onPress={() => {navigation.state.params.onRightPress()}}/>
  });
  constructor(props) {
    super (props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      token: this.props.navigation.state.params.token
    }
  }
  componentDidMount () {
    this.props.navigation.setParams({
      onRightPress: this.logout.bind(this)
    })
    console.log(this.props.navigation.state.params.token);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://newflagapp.herokuapp.com/api/feed', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.props.navigation.state.params.token
      })
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        const newState = json.response;
        console.log("NNEWSTATE",newState )
        this.setState ({
          dataSource: ds.cloneWithRows(newState)
        })
        console.log("USERS!!!!!!!!!!!!!!!!!", json.users);
      }
    })
    .catch((err) => {
      console.log('error ' + err)
    });
  }
  logout () {
    this.props.navigation.navigate('Login');
  }
  messages () {
    this.props.navigation.navigate('Inbox',{token: this.state.token});
  }

//   touchUser(user) {
//     fetch('https://hohoho-backend.herokuapp.com/messages', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         to: user._id
//       })
//     })
//     .then((resp) => resp.json())
//     .then((json) =>{
//       if (json.success){
//         //needs to navigate to messages with that user
//       }
//       console.log(user._id)
//     })
//     .catch((err) => {
//       console.log(err)
//   });
// }

//// onPress={this.touchUser.bind(this,rowData)}
render () {
  return (
    <View style={styles.containerFull}>
      <Text style={styles.textBig}>People Nearby</Text>
    <ListView dataSource = {this.state.dataSource} renderRow = {(rowData) =>
      <TouchableOpacity>
          <Text style={styles.users}>{rowData.name}</Text>
      </TouchableOpacity>}/>
      <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.messages.bind(this)}>
             <Text style={styles.buttonLabel}>Messages</Text>
           </TouchableOpacity>
      </View>
  )
}

}

class RegisterScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Register'
  });
  constructor(props) {
    super (props);
    var date = new Date()
    this.state = {
      flags: [],
      DOB: Date,
      date: date,
      school: 'Default',
      schools: ["Washington University in St. Louis", "University of North Carolina", "University of Pennsylvania", "UC Berkeley"],
      hometowns: ['San Francisco','Chapel Hill','Fort Lauderdale','Los Angeles','New York'],
      hometown: '',
      token: this.props.navigation.state.params.token
    }
  }


  submit () {
    const flags = [this.state.school,this.state.hometown];
    fetch('https://newflagapp.herokuapp.com/api/registration', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        flags: flags,
        DOB: this.state.date,
        token: this.props.navigation.state.params.token
      })
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
      this.props.navigation.navigate('Feed', {token: this.state.token});
      }
    })
    .catch((err) => {
      console.log(err)
  });
}


// logout () {
//   this.props.navigation.navigate('Login');
// }

setDate(dateObject) {
  this.setState({
    date: dateObject
  })
}


  render() {
    return (
    <View style={[styles.containerFull, styles.register]}>
      {/* <View style={{'top':'15%'}}>
        <Text>Select your hometown</Text> */}
        <PickerIOS
        style={{'top':'15%'}}
        selectedValue={this.state.hometown}
        onValueChange={(hometown) => {this.setState({hometown:hometown})}}>
        {this.state.hometowns.map((hometown) => (
          <PickerItemIOS
            key={hometown}
            value={hometown}
            label={hometown}
          />
        ))}
      </PickerIOS>
    {/* </View> */}
    {/* <View style={{'top':'2%'}}>
      <Text>Select your school</Text> */}
        <PickerIOS
        style={{'top':'2%'}}
        selectedValue={this.state.school}
        onValueChange={(school) => {this.setState({school:school})}}>
        {this.state.schools.map((school) => (
          <PickerItemIOS
            key={school}
            value={school}
            label={school}
          />
        ))}
      </PickerIOS>
    {/* </View> */}
      {/* <View>
      <Text>Enter your DOB</Text> */}
      <DatePickerIOS mode='date' date={this.state.date} onDateChange={this.setDate.bind(this)}/>
      <TouchableOpacity style={[styles.button, styles.loginBtnFacebook]} onPress={()=>{this.submit()}}>
       <Text style={styles.buttonLabel}>Submit</Text>
     </TouchableOpacity>
   {/* </View> */}
     </View>
  )
}
}

class InboxScreen extends React.Component {
  static navigationOptions = {
        title: 'Inbox'
    // headerRight: <Button title='Log Out' onPress={navigation.state.params.onRightPress}/>
  }

  constructor(props) {
    super (props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      newMessage: '',
      token : this.props.navigation.state.params.token
    }
  }
  componentDidMount () {
    // this.props.navigation.setParams({
    //   onRightPress: this.logout.bind(this)
    //})
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://newflagapp.herokuapp.com/api/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.state.token
      })
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        const newState = json.response;
        this.setState ({
          dataSource: ds.cloneWithRows(newState)
        })
      }
    })
    .catch((err) => {
      console.log('error ' + err)
    });
  }

  messages () {
    this.props.navigation.navigate('Messages', {token: this.state.token})
  }
  render () {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.textBig}>Inbox</Text>
        <ListView dataSource = {this.state.dataSource} renderRow = {(aMessage) =>
          <TouchableOpacity style={styles.messages} onPress={()=>{this.messages()}}>
          <View>
            <Text style={[styles.users,styles.buttonGreen]}>{aMessage.fromName}</Text>
          </View>
          </TouchableOpacity>
        }/>
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
        title: 'Messages'
    // headerRight: <Button title='Log Out' onPress={navigation.state.params.onRightPress}/>
  }

  constructor(props) {
    super (props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      newMessage: '',
      token: this.props.navigation.state.params.token
    }
  }
  componentDidMount () {
    // this.props.navigation.setParams({
    //   onRightPress: this.logout.bind(this)
    //})
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://newflagapp.herokuapp.com/api/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.state.token
      })
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        console.log("CONSOLE", json.response);
        const newState = json.response;
        this.setState ({
          dataSource: ds.cloneWithRows(newState)
        })
      }
    })
    .catch((err) => {
      console.log('error ' + err)
    });
  }
  render () {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.textBig}>Vanessa</Text>
        <ListView dataSource = {this.state.dataSource} renderRow = {(aMessage) =>
          (<View>
            <View style={styles.message}>
            <Text style={styles.fromMessage}>{aMessage.content}</Text>
          </View>
          <View style={styles.message}>
            <Text style={styles.toMessage}>Hi!</Text>
          </View>
          </View>)
        }
      />
      <TextInput style={{'bottom':'15%'}}
        placeholder="Enter your message..."
        value={""}
        onChangeText={(text) => this.setState({newMessage:text})}
      />
      </View>
    )
  }
}



//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Feed: {
    screen: FeedScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
  Inbox: {
    screen: InboxScreen,
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  register: {
    bottom: 60
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
    bottom: "15%"
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#B1FAE8'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  loginBtn: {
    // boxsSizing: 'borderBox',
    position: 'relative',
  /* width: 13em;  - apply for fixed size */
    margin: 20,
    // padding: 0,15,0,46,
    // border: 'none',
    textAlign: 'left',
    lineHeight: 34,
    // whiteSpace: 'nowrap',
    borderRadius: 10,
    fontSize: 16,
    color: "#FFF"
  },
  loginBtnFacebook: {
    backgroundColor: '#4C69BA',
  },
  users: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    height:35,
  },
  toMessage: {
    backgroundColor: "#2095FE",
    color: "#fff",
    marginLeft: 80,
    height: 30,
    position: 'relative'

  },
  fromMessage: {
    backgroundColor: "#E5E4E9",
    color: "#363636",
    marginRight: 80,
    height: 30,
    position: 'relative'
},
message: {
  alignSelf: 'stretch',
  paddingTop: 10,
  paddingBottom: 10,
  marginTop: 10,
  borderRadius: 20
},
messagesWrapper :{
  paddingTop: 10,
  position: 'relative',
  borderWidth: 1,
  borderColor: '#ddd'
}
    // backgroundImage: linearGradient('#4C69BA', '#3B55A0'),
  /*font-family: "Helvetica neue", Helvetica Neue, Helvetica, Arial, sans-serif;*/
    // textShadow: 0,-1,0,'#354C8C'
});
