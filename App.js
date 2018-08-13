/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  NetInfo,
  ActivityIndicator,
  TextInput,
  AsyncStorage,
  Alert
} from "react-native";
import ImageComponent from "./src/components/ImageComponent";
import SearchComponent from "./src/components/SearchComponent";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchText: "",
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      totalCount: 0,
      numColumns: 2,
      online: true,
      offlineData: []
    };
  }

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      console.log(
        "Initial, type: " +
          connectionInfo.type +
          ", effectiveType: " +
          connectionInfo.effectiveType
      );
      let reach = connectionInfo.type;
      if (
        reach == "none" ||
        reach == "NONE" ||
        reach == "unknown" ||
        reach == "UNKNOWN"
      ) {
        this.setState({ online: false });
      } else {
        this.setState({ online: true });
      }
    });
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
    AsyncStorage.getItem("offlineData").then(v => {
      let data = JSON.parse(v);
      console.log(data);
      this.setState({ offlineData: data });
    });
    //this.makeRemoteRequest();
  }

  handleFirstConnectivityChange = connectionInfo => {
    let reach = connectionInfo.type;
    if (
      reach == "none" ||
      reach == "NONE" ||
      reach == "unknown" ||
      reach == "UNKNOWN"
    ) {
      this.setState({ online: false });
    } else {
      this.setState({ online: true });
    }
  };

  makeRemoteRequest = searchText => {
    const { page } = this.state;
    const url = `https://api.shutterstock.com/v2/images/search?query=${searchText}&&page=${page}`;
    this.setState({ loading: true });
    if (this.state.online) {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic  NjViY2YtMTE0NWUtMTQ4ZTMtZDk5MTEtNGQ1NWUtYzllZWI6NjEzNDYtMDczMjktN2FjNzMtZmYwMGMtMDA5ZWYtOTdlY2Q="
        }
      })
        .then(res => res.json())
        .then(res => {
          console.log("hiiii", res);

          this.setState({
            data: page === 1 ? res.data : [...this.state.data, ...res.data],
            error: res.error || null,
            loading: false,
            totalCount: res.total_count,
            refreshing: false
          });

          AsyncStorage.setItem("offlineData", JSON.stringify(this.state.data));
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    } else {
      if (this.state.offlineData) {
        this.setState({ data: this.state.offlineData });
      } else {
        Alert.alert("No Internet");
      }
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest(this.state.searchText);
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 40,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  onSearchPress = t => {
    this.setState({
      searchText: t,
      page: 1,
      data: []
    });
    this.makeRemoteRequest(t);
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchComponent onSearch={t => this.onSearchPress(t)} />
        <Text style={{padding:10}}>No of column in Grid</Text>
        <TextInput
          placeholder="Enter number of column"
          style={{
            borderRadius: 5,
            backgroundColor: "#fff",
            borderWidth: 1,
            height:40,
            borderColor: "#d4d4d4",
            margin: 10
          }}
          value={this.state.numColumns ? String(this.state.numColumns) : ""}
          onChangeText={t => this.setState(() => ({ numColumns: Number(t) }))}
          clearButtonMode="never"
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ImageComponent imageURI={item.assets.large_thumb.url} />
          )}
          removeClippedSubviews
          key={this.state.numColumns + this.state.page}
          numColumns={this.state.numColumns || 1}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.4}
        />
      </View>
    );
  }
}
