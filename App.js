/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, { Component } from 'react';

import { ActivityIndicator, NetInfo } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './src/store';
import MyGrid from './src/MyGrid';


class App extends Component {

  componentDidMount = () => {
    NetInfo.addEventListener("connectionChange", () =>
      this.handleFirstConnectivityChange()
    );
  };
  componentWillUnmount = () => {
    NetInfo.removeEventListener("connectionChange", () =>
      this.handleFirstConnectivityChange()
    );
  };


  handleFirstConnectivityChange = () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      let reach = connectionInfo.type;
      if (
        reach == "none" ||
        reach == "NONE" ||
        reach == "unknown" ||
        reach == "UNKNOWN"
      ) {
        store.dispatch({
          type: "TOGGLE_INTERNET_CONNECTION",
          internet: false
        });
      } else {
        store.dispatch({
          type: "TOGGLE_INTERNET_CONNECTION",
          internet: true
        });
      }
    });
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator size="large" animating />} persistor={persistor}>
          <MyGrid />
        </PersistGate>
      </Provider>
    );
  }
};

export default App;

