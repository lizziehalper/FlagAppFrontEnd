import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';



//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  }

login  = async() => {
  console.log('login function')
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
    fetch('https://hohoho-backend.herokuapp.com/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: `${token}`
    })
  })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        register();
      }
    })
    .catch((err) => {
      alert('error ' + err)
    });
  }
}
register() {
  this.props.navigation.navigate('Register');
}


  render() {
    return (
      <View style={styles.container}>
        <Button title= "login with facebook" onPress={this.login.bind(this)}/>
      </View>
    )
  }
}


class FeedScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Users',
    headerRight: <Button title='LogOut' onPress={() => {navigation.state.params.onRightPress()}}/>
  });
  constructor(props) {
    super (props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }
  componentDidMount () {
    this.props.navigation.setParams({
      onRightPress: this.logout.bind(this)
    })
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        const newState = json.users;
        this.setState ({
          dataSource: ds.cloneWithRows(newState)
        })
        console.log(json.users);
      }
    })
    .catch((err) => {
      console.log('error ' + err)
    });
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((resp) => resp.json())
    .then((json) =>{
      if (json.success){
        //needs to navigate to messages with that user
      }
      console.log(user._id)
    })
    .catch((err) => {
      console.log(err)
  });
}


logout () {
  this.props.navigation.navigate('Login');
}

  render () {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.textBig}>Users</Text>
      <ListView dataSource = {this.state.dataSource} renderRow = {(rowData) =>
        <TouchableOpacity
          onPress={this.touchUser.bind(this,rowData)}>
          <Text style={styles.users}>{rowData.username}</Text></TouchableOpacity>}/>
        </View>
    )
  }
}

class


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Feed: {
    screen: FeedScreen,
  },
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
