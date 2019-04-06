import { StyleSheet, Text, View, Button } from 'react-native';
import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation';
import React, { Component } from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

let store = createStore(combineReducers({ count: counter }));

class WelcomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Dashboard')}
        />
        <Button title="Sign Up" onPress={() => alert('button pressed')} />
      </View>
    );
  }
}

class DashboardScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Dashboard Screen</Text>
      </View>
    );
  }
}

class Feed extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Go To Detail Screen"
          onPress={() => this.props.navigation.navigate('Detail')}
        />
      </View>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}

class Counter extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.count}</Text>
        <Button
          title="Increment"
          onPress={() => this.props.dispatch({ type: 'INCREMENT' })}
        />
        <Button
          title="Decrement"
          onPress={() => this.props.dispatch({ type: 'DECREMENT' })}
        />
        <Button
          title="Go to Static Count Screen"
          onPress={() => this.props.navigation.navigate('StaticCounter')}
        />
      </View>
    );
  }
}

class StaticCounter extends Component {
  static navigationOptions = {
    title: `Same number, wow!`
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.count}</Text>
      </View>
    );
  }
}

let CounterContainer = connect(state => ({ count: state.count }))(Counter);
let StaticCounterContainer = connect(state => ({ count: state.count }))(
  StaticCounter
);

const Detail = props => (
  <View style={styles.container}>
    <Text>Detail</Text>
  </View>
);

const FeedStack = createStackNavigator(
  {
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Feed',
          headerLeft: (
            <Icon
              style={{ paddingLeft: 10 }}
              name="md-menu"
              size={30}
              onPress={() => navigation.openDrawer()}
            />
          )
        };
      }
    },
    Detail: {
      screen: Detail,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Details'
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const CounterStack = createStackNavigator({
  Counter: {
    screen: CounterContainer,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Counter',
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        )
      };
    }
  },
  StaticCounter: StaticCounterContainer
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Settings',
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        )
      };
    }
  }
});

const DashboardTabNavigator = createBottomTabNavigator(
  {
    FeedStack,
    CounterStack,
    SettingsStack
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];

      return {
        header: null,
        headerTitle: routeName
      };
    }
  }
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        )
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: { screen: WelcomeScreen },
  Dashboard: { screen: AppDrawerNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
